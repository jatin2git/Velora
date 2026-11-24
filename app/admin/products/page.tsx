
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Product = {
  id: number;
  name: string;
  category: "bedsheet" | "comforter" | "pillow-covers" | "ac-comforter-set";
  image: string | null;
  images: string[] | null;
  price: number;
  mrp: number | null;
  fabric: string | null;
  size: string | null;
  color: string | null;
  description: string | null;
  stock: number;
  is_active: boolean;
  created_at: string;
};

type ProductForm = {
  name: string;
  category: "bedsheet" | "comforter" | "pillow-covers" | "ac-comforter-set";
  mrp: string;
  price: string;
  fabric: string;
  size: string;
  color: string;
  description: string;
  stock: string;
};

const emptyForm: ProductForm = {
  name: "",
  category: "bedsheet",
  mrp: "",
  price: "0",
  fabric: "",
  size: "",
  color: "",
  description: "",
  stock: "0",
};

export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      router.replace("/admin/login");
      return;
    }

    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("role")
      .eq("user_id", data.session.user.id)
      .maybeSingle();

    if (error || !admin || !["owner", "staff"].includes(admin.role)) {
      await supabase.auth.signOut();
      router.replace("/admin/login");
      return;
    }

    await loadProducts();
  }

  async function loadProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Products load nahi ho paye: " + error.message);
    } else {
      setProducts((data || []) as Product[]);
    }

    setLoading(false);
  }

  function updateField(field: keyof ProductForm, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setSelectedFiles([]);
    setEditingProduct(null);

    const fileInput = document.getElementById(
      "product-images"
    ) as HTMLInputElement | null;

    if (fileInput) fileInput.value = "";
  }

  function editProduct(product: Product) {
    setEditingProduct(product);

    setForm({
      name: product.name,
      category: product.category,
      mrp: product.mrp ? String(product.mrp) : "",
      price: String(product.price ?? 0),
      fabric: product.fabric || "",
      size: product.size || "",
      color: product.color || "",
      description: product.description || "",
      stock: String(product.stock ?? 0),
    });

    setSelectedFiles([]);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImages() {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
      const filePath = `${Date.now()}-${i}-${safeName}`;

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          upsert: false,
        });

      if (error) {
        throw new Error("Image upload failed: " + error.message);
      }

      const { data: publicData } = supabase.storage
        .from("product-images")
        .getPublicUrl(data.path);

      uploadedUrls.push(publicData.publicUrl);
    }

    return uploadedUrls;
  }

  async function saveProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (!form.name.trim()) {
      setMessage("Product ka naam enter karo.");
      return;
    }

    const price = Number(form.price);
    const mrp = form.mrp.trim() === "" ? null : Number(form.mrp);
    const stock = Number(form.stock);

    if (!Number.isFinite(price) || price < 0) {
      setMessage("Valid selling price enter karo.");
      return;
    }

    if (
      mrp !== null &&
      (!Number.isFinite(mrp) || mrp <= 0)
    ) {
      setMessage("Valid MRP enter karo.");
      return;
    }

    if (mrp !== null && mrp < price) {
      setMessage("MRP selling price se kam nahi ho sakta.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setMessage("Stock mein valid whole number enter karo.");
      return;
    }

    setSaving(true);

    try {
      const uploadedUrls = await uploadImages();

      const existingImages = editingProduct
        ? editingProduct.images?.length
          ? editingProduct.images
          : editingProduct.image
            ? [editingProduct.image]
            : []
        : [];

      const allImages = [...existingImages, ...uploadedUrls];

      const productData = {
        name: form.name.trim(),
        category: form.category,
        mrp,
        price,
        fabric: form.fabric.trim(),
        size: form.size.trim(),
        color: form.color.trim(),
        description: form.description.trim(),
        stock,
        images: allImages,
        image: allImages[0] || null,
      };

      let error;

      if (editingProduct) {
        const result = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        error = result.error;
      } else {
        const result = await supabase
          .from("products")
          .insert(productData);

        error = result.error;
      }

      if (error) {
        throw new Error(error.message);
      }

      setMessage(
        editingProduct
          ? "Product successfully update ho gaya!"
          : "New product successfully add ho gaya!"
      );

      resetForm();
      await loadProducts();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Kya aap "${product.name}" ko delete karna chahte hain?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      setMessage("Delete failed: " + error.message);
      return;
    }

    if (editingProduct?.id === product.id) {
      resetForm();
    }

    setMessage("Product delete ho gaya.");
    await loadProducts();
  }

  async function toggleActive(product: Product) {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id);

    if (error) {
      setMessage("Status update nahi hua: " + error.message);
      return;
    }

    await loadProducts();
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      filter === "all" || product.category === filter;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-[#24211e]">
      <header className="border-b border-[#dedbd5] bg-white px-5 py-5 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl tracking-[0.15em]">
              VELORA
            </h1>
            <p className="mt-1 text-[10px] tracking-[0.25em] text-[#8a8178]">
              PRODUCT MANAGEMENT
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="border border-[#d8d1c8] px-4 py-2 text-xs transition hover:bg-[#24211e] hover:text-white"
            >
              DASHBOARD
            </button>

            <button
              onClick={logout}
              className="bg-[#24211e] px-4 py-2 text-xs text-white transition hover:bg-[#66594c]"
            >
              LOG OUT
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 md:px-10">
        <div className="mb-8">
          <h2 className="font-serif text-3xl">Manage Products</h2>
          <p className="mt-2 text-sm text-[#817970]">
            Add, edit and manage your Velora products.
          </p>
        </div>

        {message && (
          <div className="mb-6 border border-[#d8d1c8] bg-white px-5 py-3 text-sm">
            {message}
          </div>
        )}

        <section className="mb-12 bg-white p-5 shadow-sm md:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-serif text-2xl">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>

            {editingProduct && (
              <button
                onClick={resetForm}
                type="button"
                className="text-xs underline"
              >
                CANCEL EDIT
              </button>
            )}
          </div>

          <form onSubmit={saveProduct} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs tracking-wider">
                  PRODUCT NAME *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Enter product name"
                  className="w-full border border-[#dedbd5] px-4 py-3 text-sm outline-none focus:border-[#8a8178]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs tracking-wider">
                  CATEGORY *
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    updateField("category", e.target.value)
                  }
                  className="w-full border border-[#dedbd5] bg-white px-4 py-3 text-sm outline-none"
                >
                  <option value="bedsheet">Bedsheet</option>
                  <option value="pillow-covers">Pillow Covers</option>
                  <option value="comforter">Plain Comforter</option>
                  <option value="ac-comforter-set">AC Comforter Set</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs tracking-wider">
                  MRP / ORIGINAL PRICE (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.mrp}
                  onChange={(e) => updateField("mrp", e.target.value)}
                  placeholder="Example: 999"
                  className="w-full border border-[#dedbd5] px-4 py-3 text-sm outline-none"
                />
                <p className="mt-1 text-[11px] text-[#8a8178]">
                  Original price before discount.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-xs tracking-wider">
                  SELLING PRICE (₹) *
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="Example: 799"
                  className="w-full border border-[#dedbd5] px-4 py-3 text-sm outline-none"
                />
                <p className="mt-1 text-[11px] text-[#8a8178]">
                  Final price customer will pay.
                </p>
              </div>

              {form.mrp.trim() !== "" &&
                Number(form.mrp) > Number(form.price) &&
                Number(form.mrp) > 0 && (
                  <div className="md:col-span-2 border border-[#e7dfd2] bg-[#faf7f0] p-4">
                    <p className="text-xs tracking-wider text-[#817970]">
                      AUTOMATIC DISCOUNT PREVIEW
                    </p>
                    <p className="mt-2 font-serif text-xl">
                      {Math.round(
                        ((Number(form.mrp) - Number(form.price)) /
                          Number(form.mrp)) *
                          100
                      )}
                      % OFF
                    </p>
                    <p className="mt-1 text-xs text-[#817970]">
                      Customer saves ₹
                      {(Number(form.mrp) - Number(form.price)).toLocaleString("en-IN")}
                    </p>
                  </div>
                )}

              <div>
                <label className="mb-2 block text-xs tracking-wider">
                  STOCK QUANTITY
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(e) => updateField("stock", e.target.value)}
                  className="w-full border border-[#dedbd5] px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs tracking-wider">
                  FABRIC
                </label>
                <input
                  value={form.fabric}
                  onChange={(e) => updateField("fabric", e.target.value)}
                  placeholder="Cotton, Microfiber..."
                  className="w-full border border-[#dedbd5] px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs tracking-wider">
                  SIZE
                </label>
                <input
                  value={form.size}
                  onChange={(e) => updateField("size", e.target.value)}
                  placeholder="King Size, Queen Size..."
                  className="w-full border border-[#dedbd5] px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs tracking-wider">
                  COLOUR
                </label>
                <input
                  value={form.color}
                  onChange={(e) => updateField("color", e.target.value)}
                  placeholder="Beige, White, Grey..."
                  className="w-full border border-[#dedbd5] px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs tracking-wider">
                  PRODUCT PHOTOS
                </label>
                <input
                  id="product-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setSelectedFiles(Array.from(e.target.files || []))
                  }
                  className="w-full border border-[#dedbd5] bg-white px-3 py-2.5 text-xs"
                />
                <p className="mt-2 text-[11px] text-[#8a8178]">
                  Aap ek product ki multiple photos select kar sakte hain.
                </p>
              </div>
            </div>

            {editingProduct && (
              <div>
                <p className="mb-3 text-xs tracking-wider">
                  CURRENT PRODUCT PHOTOS
                </p>
                <div className="flex flex-wrap gap-3">
                  {(editingProduct.images?.length
                    ? editingProduct.images
                    : editingProduct.image
                      ? [editingProduct.image]
                      : []
                  ).map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt="Product"
                      className="h-20 w-20 border border-[#dedbd5] object-cover"
                    />
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-[#8a8178]">
                  Nayi photos select karne par woh existing photos ke saath add hongi.
                </p>
              </div>
            )}

            {selectedFiles.length > 0 && (
              <p className="text-xs text-[#716b64]">
                {selectedFiles.length} new photo(s) selected.
              </p>
            )}

            <div>
              <label className="mb-2 block text-xs tracking-wider">
                DESCRIPTION
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) =>
                  updateField("description", e.target.value)
                }
                placeholder="Write product description..."
                className="w-full border border-[#dedbd5] px-4 py-3 text-sm outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-[#24211e] px-8 py-3 text-xs tracking-[0.15em] text-white transition hover:bg-[#66594c] disabled:opacity-50"
            >
              {saving
                ? "PLEASE WAIT..."
                : editingProduct
                  ? "UPDATE PRODUCT"
                  : "SAVE PRODUCT"}
            </button>
          </form>
        </section>

        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl">All Products</h3>
              <p className="mt-1 text-xs text-[#8a8178]">
                {products.length} products in your database
              </p>
            </div>

            <button
              onClick={loadProducts}
              className="border border-[#d8d1c8] px-4 py-2 text-xs transition hover:bg-white"
            >
              REFRESH
            </button>
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product..."
              className="w-full border border-[#dedbd5] bg-white px-4 py-3 text-sm outline-none"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-[#dedbd5] bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="all">All Categories</option>
              <option value="bedsheet">Bedsheets</option>
              <option value="pillow-covers">Pillow Covers</option>
              <option value="comforter">Plain Comforter</option>
              <option value="ac-comforter-set">AC Comforter Set</option>
            </select>
          </div>

          {loading ? (
            <div className="bg-white p-10 text-center text-sm">
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white p-10 text-center text-sm text-[#817970]">
              No products found.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map((product) => {
                const hasDiscount =
                  product.mrp !== null &&
                  Number(product.mrp) > Number(product.price);

                const discount = hasDiscount
                  ? Math.round(
                      ((Number(product.mrp) - Number(product.price)) /
                        Number(product.mrp)) *
                        100
                    )
                  : 0;

                return (
                  <div
                    key={product.id}
                    className="flex flex-col gap-4 border border-[#e3dfd8] bg-white p-4 sm:flex-row sm:items-center"
                  >
                    <div className="h-24 w-24 shrink-0 bg-[#eeeae4]">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="font-serif text-lg">{product.name}</h4>
                      <p className="mt-1 text-xs capitalize text-[#817970]">
                        {product.category} · {product.fabric || "Fabric not added"}
                      </p>
                      <p className="mt-2 text-xs">
                        {hasDiscount ? (
                          <>
                            <span className="text-[#817970] line-through">
                              ₹{Number(product.mrp).toLocaleString("en-IN")}
                            </span>{" "}
                            <strong>
                              ₹{Number(product.price).toLocaleString("en-IN")}
                            </strong>{" "}
                            <span className="text-green-700">
                              {discount}% OFF
                            </span>
                          </>
                        ) : (
                          <>₹{Number(product.price).toLocaleString("en-IN")}</>
                        )}
                        {" · "}Stock: {product.stock}
                      </p>
                      <p className="mt-1 text-[11px] text-[#817970]">
                        {product.is_active ? "Active on website" : "Hidden from website"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => editProduct(product)}
                        className="border border-[#d8d1c8] px-3 py-2 text-xs transition hover:bg-[#f8f6f2]"
                      >
                        EDIT
                      </button>

                      <button
                        onClick={() => toggleActive(product)}
                        className="border border-[#d8d1c8] px-3 py-2 text-xs transition hover:bg-[#f8f6f2]"
                      >
                        {product.is_active ? "HIDE" : "ACTIVATE"}
                      </button>

                      <button
                        onClick={() => deleteProduct(product)}
                        className="border border-red-200 px-3 py-2 text-xs text-red-700 transition hover:bg-red-50"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

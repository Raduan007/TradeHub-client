"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Alert,
  Button,
  Card,
  Chip,
  Description,
  FieldError,
  Input,
  Label,
  ListBox,
  Radio,
  RadioGroup,
  Select,
  TextArea,
  TextField,
} from "@heroui/react";
import {
  FaArrowLeft,
  FaBox,
  FaCheckCircle,
  FaCloudUploadAlt,
  FaDollarSign,
  FaImage,
  FaInfoCircle,
  FaList,
  FaTag,
  FaWarehouse,
} from "react-icons/fa";

import { formatCurrency } from "@/lib/format";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const CATEGORIES = [
  { key: "electronics", label: "Electronics" },
  { key: "fashion", label: "Fashion & Apparel" },
  { key: "furniture", label: "Furniture & Decor" },
  { key: "vehicles", label: "Vehicles & Parts" },
  { key: "mobile", label: "Mobile Phones & Access." },
  { key: "books", label: "Books & Education" },
  { key: "sports", label: "Sports & Outdoors" },
  { key: "others", label: "Others" },
];

const INITIAL_FORM_STATE = {
  name: "",
  category: "",
  brand: "",
  condition: "new",
  description: "",
  price: "",
  stock: "1",
  image: "",
};

export default function AddProductPage() {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, category: value }));
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };

  const handleConditionChange = (value) => {
    setForm((prev) => ({ ...prev, condition: value }));
    if (errors.condition) {
      setErrors((prev) => ({ ...prev, condition: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Product name is required.";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Product name must be at least 3 characters.";
    }

    if (!form.category) {
      newErrors.category = "Please select a category.";
    }

    if (!form.brand.trim()) {
      newErrors.brand = "Brand name is required.";
    }

    if (!form.condition) {
      newErrors.condition = "Please select a product condition.";
    }

    if (!form.description.trim()) {
      newErrors.description = "Product description is required.";
    } else if (form.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }

    const priceNum = parseFloat(form.price);
    if (!form.price) {
      newErrors.price = "Price is required.";
    } else if (isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = "Price must be a valid positive number.";
    }

    const stockNum = parseInt(form.stock, 10);
    if (!form.stock) {
      newErrors.stock = "Stock quantity is required.";
    } else if (isNaN(stockNum) || stockNum < 0) {
      newErrors.stock = "Stock quantity must be a non-negative integer.";
    }

    if (!form.image.trim()) {
      newErrors.image = "Product image URL is required.";
    } else {
      try {
        new URL(form.image);
      } catch (_) {
        newErrors.image = "Please enter a valid absolute URL (e.g., https://...).";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        brand: form.brand.trim(),
        condition: form.condition,
        description: form.description.trim(),
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        image: form.image.trim(),
      };

      const response = await fetch("/api/seller/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to add product");
      }

      setIsSuccess(true);
    } catch (err) {
      setApiError(err.message || "An error occurred while adding the product.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM_STATE);
    setErrors({});
    setApiError("");
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 text-center animate-fadeIn">
        <Card className="border border-slate-200 p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500 dark:bg-green-950/30">
            <FaCheckCircle className="h-12 w-12" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Product Listed Successfully!
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Your item <span className="font-semibold text-slate-900 dark:text-white">"{form.name}"</span> has been successfully posted. Customers will now be able to view and purchase it.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              color="primary"
              variant="flat"
              onPress={handleReset}
              className="font-medium"
            >
              Add Another Product
            </Button>
            <Link href="/dashboard/seller" className="w-full sm:w-auto">
              <Button
                color="primary"
                className="w-full font-medium"
              >
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Link href="/dashboard/seller" className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400">
              <FaArrowLeft className="h-3 w-3" /> Back to Dashboard
            </Link>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
            Add New Product
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-300">
            List a new product for sale on the TradeHub marketplace.
          </p>
        </div>
      </div>

      {apiError && (
        <Alert
          className="border border-red-200/50 bg-red-50/50 dark:border-red-950/40 dark:bg-red-950/20"
          color="danger"
          title="Submission Failed"
          description={apiError}
        />
      )}

      {/* Main Grid Content */}
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Form Column */}
        <Card className="border border-slate-200 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Row 1: Product Name & Category */}
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField isRequired isInvalid={!!errors.name} className="flex flex-col gap-1">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Product Name</Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. iPhone 15 Pro Max"
                  variant="bordered"

                />
                <FieldError className="text-xs text-red-500 mt-1">{errors.name}</FieldError>
              </TextField>

              <div className="flex flex-col gap-1">
                <Select
                  name="category"
                  selectedKeys={form.category ? [form.category] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];
                    handleSelectChange({ target: { name: "category", value: selected } });
                  }}
                  variant="bordered"
                  isRequired
                  isInvalid={!!errors.category}
                >
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category</Label>
                  <Select.Trigger className="flex items-center gap-2">
                    <FaList className="text-slate-400" />
                    <Select.Value placeholder="Select category" />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {CATEGORIES.map((cat) => (
                        <ListBox.Item id={cat.key} key={cat.key} textValue={cat.label}>
                          {cat.label}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                  <FieldError className="text-xs text-red-500 mt-1">{errors.category}</FieldError>
                </Select>
              </div>
            </div>

            {/* Row 2: Brand & Condition */}
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField isRequired isInvalid={!!errors.brand} className="flex flex-col gap-1">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Brand</Label>
                <Input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="e.g. Apple"
                  variant="bordered"
                  startContent={<FaBox className="text-slate-400" />}
                />
                <FieldError className="text-xs text-red-500 mt-1">{errors.brand}</FieldError>
              </TextField>

              <div className="flex flex-col justify-center rounded-xl border border-slate-200 px-3 py-1.5 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Condition *</span>
                <RadioGroup
                  orientation="horizontal"
                  value={form.condition}
                  onValueChange={handleConditionChange}
                  className="mt-1"
                >
                  <Radio value="new" className="text-sm">New</Radio>
                  <Radio value="used" className="text-sm">Used</Radio>
                </RadioGroup>
                {errors.condition && (
                  <span className="text-xs text-red-500 mt-1">{errors.condition}</span>
                )}
              </div>
            </div>

            {/* Row 3: Product Image URL */}
            <TextField isRequired isInvalid={!!errors.image} className="flex flex-col gap-1">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Product Image URL</Label>
              <Input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                variant="bordered"
                startContent={<FaImage className="text-slate-400" />}
              />
              <Description className="text-[11px] text-slate-500 mt-0.5">Provide an absolute web address to the product image.</Description>
              <FieldError className="text-xs text-red-500 mt-1">{errors.image}</FieldError>
            </TextField>

            {/* Row 4: Pricing & Inventory */}
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField isRequired isInvalid={!!errors.price} className="flex flex-col gap-1">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Price</Label>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  variant="bordered"
                  startContent={<FaDollarSign className="text-slate-400" />}
                />
                <FieldError className="text-xs text-red-500 mt-1">{errors.price}</FieldError>
              </TextField>

              <TextField isRequired isInvalid={!!errors.stock} className="flex flex-col gap-1">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Stock Quantity</Label>
                <Input
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="1"
                  variant="bordered"
                  startContent={<FaWarehouse className="text-slate-400" />}
                />
                <FieldError className="text-xs text-red-500 mt-1">{errors.stock}</FieldError>
              </TextField>
            </div>

            {/* Row 5: Description */}
            <TextField isRequired isInvalid={!!errors.description} className="flex flex-col gap-1">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Description</Label>
              <TextArea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of the item..."
                variant="bordered"
                minRows={4}
              />
              <FieldError className="text-xs text-red-500 mt-1">{errors.description}</FieldError>
            </TextField>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
              <Link href="/dashboard/seller" className="w-full sm:w-auto">
                <Button
                  type="button"
                  variant="flat"
                  className="w-full font-medium"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                color="primary"
                isLoading={isLoading}
                className="w-full sm:w-auto font-medium"
              >
                Add Product
              </Button>
            </div>
          </form>
        </Card>

        {/* Live Preview Column */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Live Marketplace Preview
          </h3>
          
          <Card className="overflow-hidden border border-slate-200 shadow-lg dark:border-slate-800 dark:bg-slate-900 group">
            {/* Product Image Container */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950 flex items-center justify-center border-b border-slate-200 dark:border-slate-800">
              {form.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.image}
                  alt={form.name || "Product Preview"}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = "none";
                    const p = e.target.parentElement;
                    const fallback = p.querySelector(".image-fallback");
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
              ) : null}

              {/* Fallback & Initial placeholder */}
              <div 
                className={`image-fallback flex flex-col items-center justify-center p-6 text-slate-400 ${
                  form.image ? "hidden" : "flex"
                }`}
              >
                <FaCloudUploadAlt className="h-10 w-10 mb-2 text-slate-300 dark:text-slate-700" />
                <span className="text-xs text-center font-medium">Image preview will show here</span>
              </div>

              {/* Condition Badge */}
              <div className="absolute left-3 top-3">
                <Chip
                  size="sm"
                  color={form.condition === "new" ? "success" : "warning"}
                  className="font-bold uppercase text-[9px] shadow-sm text-white"
                >
                  {form.condition === "new" ? "New" : "Used"}
                </Chip>
              </div>
            </div>

            {/* Product Meta */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {form.category
                    ? CATEGORIES.find((c) => c.key === form.category)?.label
                    : "Category"}
                </span>
                
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Stock: <span className="font-semibold text-slate-800 dark:text-slate-200">{form.stock || "0"}</span>
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                  {form.name || "Untitled Product"}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Brand: {form.brand || "Generic"}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-medium">Price</span>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {form.price && !isNaN(parseFloat(form.price))
                      ? formatCurrency(parseFloat(form.price))
                      : "$0.00"}
                  </span>
                </div>

                <Button
                  size="sm"
                  color="primary"
                  className="font-bold text-xs"
                  disabled
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </Card>

          {/* Guidelines info card */}
          <Card className="border border-blue-100 bg-blue-50/20 p-4 dark:border-blue-950/30 dark:bg-blue-950/10">
            <h4 className="text-xs font-bold text-blue-800 dark:text-blue-400 flex items-center gap-1.5">
              <FaInfoCircle /> Tips for a great listing
            </h4>
            <ul className="mt-2 text-[11px] text-blue-700/80 dark:text-blue-300/70 space-y-1 list-disc list-inside">
              <li>Add crisp, high-resolution product photos.</li>
              <li>Set a competitive price based on condition.</li>
              <li>Provide accurate dimensions and brand details.</li>
              <li>Be transparent about any defects or wear.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useProducts, useUpdateProduct, useDeleteProduct, useCreateProduct } from "@/hooks/use-products";
import { useOrders, useUpdateOrderStatus } from "@/hooks/use-orders";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Package,
  ShoppingCart,
  Plus,
  Pencil,
  Trash2,
  DollarSign,
  LogOut,
  X,
  Eye,
  AlertTriangle,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  Boxes
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const createProduct = useCreateProduct();
  const updateOrderStatus = useUpdateOrderStatus();
  const { toast } = useToast();
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [scentType, setScentType] = useState("Neutral");
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    if (editingProduct) {
      setScentType(editingProduct.scentType || "Neutral");
    } else if (isAdding) {
      setScentType("Neutral");
    }
  }, [editingProduct, isAdding]);

  const handleUpdateStatus = (id: number, status: string) => {
    updateOrderStatus.mutate({ id, status }, {
      onSuccess: () => {
        toast({ title: "Order status updated successfully" });
      }
    });
  };

  const handleProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const productData = {
      name: data.name as string,
      description: data.description as string,
      price: data.price as string,
      scentType: scentType,
      isActive: data.isActive === "on" ? "true" : "false",
      imageUrl: data.imageUrl as string,
      isBestSeller: data.isBestSeller === "on",
      initialQuantity: !editingProduct ? Number(data.initialQuantity) : undefined,
    };

    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id, ...productData }, {
        onSuccess: () => {
          setEditingProduct(null);
          toast({ title: "Product updated successfully" });
        }
      });
    } else {
      createProduct.mutate(productData, {
        onSuccess: () => {
          setIsAdding(false);
          toast({ title: "Product created successfully" });
        }
      });
    }
  };

  // Stats
  const totalRevenue = orders?.reduce((acc, order) => {
    if (order.status !== 'CANCELLED') return acc + Number(order.totalAmount);
    return acc;
  }, 0) || 0;

  const activeProductsCount = products?.filter(p => p.isActive === 'true').length || 0;
  const totalOrdersCount = orders?.length || 0;
  const pendingOrdersCount = orders?.filter(o => o.status === 'PENDING').length || 0;
  const lowStockProducts = products?.filter(p => (p.quantityAvailable ?? 0) <= 5 && (p.quantityAvailable ?? 0) > 0).length || 0;
  const outOfStockProducts = products?.filter(p => (p.quantityAvailable ?? 0) <= 0).length || 0;

  const closeForm = () => { setEditingProduct(null); setIsAdding(false); };

  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
    SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
  };

  const getStockBadge = (qty: number) => {
    if (qty <= 0) return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">Out of Stock</Badge>;
    if (qty <= 5) return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">{qty} left</Badge>;
    return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">{qty} in stock</Badge>;
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, <span className="font-semibold text-foreground">{user?.name}</span></p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all"
            onClick={() => logoutMutation.mutate(undefined, {
              onSuccess: () => setLocation("/auth")
            })}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="pt-5 pb-5 px-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Revenue</p>
                  <h3 className="text-xl font-bold truncate">{totalRevenue.toFixed(0)} EGP</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-sm">
            <CardContent className="pt-5 pb-5 px-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-600 shrink-0">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Orders</p>
                  <h3 className="text-xl font-bold">{totalOrdersCount}
                    {pendingOrdersCount > 0 && <span className="text-xs font-medium text-amber-600 ml-1">({pendingOrdersCount} pending)</span>}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-sm">
            <CardContent className="pt-5 pb-5 px-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-600 shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Products</p>
                  <h3 className="text-xl font-bold">{activeProductsCount} <span className="text-xs font-medium text-muted-foreground">active</span></h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-sm">
            <CardContent className="pt-5 pb-5 px-5">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 ${outOfStockProducts > 0 ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                  <Boxes className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</p>
                  <h3 className="text-xl font-bold">
                    {outOfStockProducts > 0
                      ? <span className="text-red-600">{outOfStockProducts} out</span>
                      : <span className="text-emerald-600">All good</span>
                    }
                    {lowStockProducts > 0 && <span className="text-xs font-medium text-amber-600 ml-1">({lowStockProducts} low)</span>}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="bg-secondary/50 border border-border/50 p-1 rounded-xl w-full max-w-sm grid grid-cols-2">
            <TabsTrigger value="inventory" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all text-sm">
              <Package className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all text-sm">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Orders {pendingOrdersCount > 0 && <span className="ml-1.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendingOrdersCount}</span>}
            </TabsTrigger>
          </TabsList>

          {/* ==================== INVENTORY TAB ==================== */}
          <TabsContent value="inventory" className="animate-in fade-in-50 duration-200">
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
                <div>
                  <CardTitle className="text-xl">Products</CardTitle>
                  <CardDescription>{products?.length || 0} total products</CardDescription>
                </div>
                <Button
                  onClick={() => { setIsAdding(true); setEditingProduct(null); }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Product
                </Button>
              </CardHeader>
              <CardContent className="pt-6">

                {/* ============ ADD / EDIT FORM ============ */}
                {(isAdding || editingProduct) && (
                  <div className="mb-8 border border-border rounded-xl overflow-hidden shadow-sm">
                    {/* Form Header */}
                    <div className="bg-secondary/40 border-b border-border/50 px-6 py-4 flex justify-between items-center">
                      <h3 className="font-bold text-base flex items-center gap-2">
                        {editingProduct ? <Pencil className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-primary" />}
                        {editingProduct ? `Editing: ${editingProduct.name}` : "New Product"}
                      </h3>
                      <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleProductSubmit} className="p-6">
                      {/* Row 1: Name, Price, Stock */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                        <div className="space-y-1.5">
                          <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Product Name *</Label>
                          <Input name="name" defaultValue={editingProduct?.name} required placeholder="e.g. Midnight Oud" className="bg-background h-11" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Price (EGP) *</Label>
                          <Input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required placeholder="0.00" className="bg-background h-11" />
                        </div>
                        {!editingProduct ? (
                          <div className="space-y-1.5">
                            <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Initial Stock *</Label>
                            <Input name="initialQuantity" type="number" defaultValue="0" min="0" required className="bg-background h-11" />
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Current Stock</Label>
                            <div className="h-11 flex items-center px-3 rounded-md border border-input bg-muted/50 text-sm font-medium">
                              {editingProduct.quantityAvailable ?? 0} units
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Row 2: Scent Type + Image URL */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div className="space-y-1.5">
                          <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Scent Category</Label>
                          <Select value={scentType} onValueChange={setScentType}>
                            <SelectTrigger className="bg-background h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent position="popper" sideOffset={4} className="z-[9999]">
                              <SelectItem value="Refreshing">🌿 Refreshing</SelectItem>
                              <SelectItem value="Floral">🌸 Floral</SelectItem>
                              <SelectItem value="Woody">🪵 Woody</SelectItem>
                              <SelectItem value="Oriental">✨ Oriental</SelectItem>
                              <SelectItem value="Neutral">🍃 Neutral</SelectItem>
                            </SelectContent>
                          </Select>
                          <input type="hidden" name="scentType" value={scentType} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Image URL *</Label>
                          <Input name="imageUrl" defaultValue={editingProduct?.imageUrl} required placeholder="https://example.com/image.jpg" className="bg-background h-11" />
                        </div>
                      </div>

                      {/* Row 3: Description (full width) */}
                      <div className="space-y-1.5 mb-5">
                        <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Description</Label>
                        <textarea
                          name="description"
                          defaultValue={editingProduct?.description}
                          placeholder="Describe the scent profile, notes, and experience..."
                          rows={3}
                          className="w-full px-3 py-2.5 rounded-md bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                        />
                      </div>

                      {/* Toggles */}
                      <div className="flex items-center gap-8 mb-6">
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            name="isActive"
                            className="w-4 h-4 rounded border-primary text-primary focus:ring-primary"
                            defaultChecked={editingProduct ? editingProduct.isActive === 'true' : true}
                          />
                          <span className="text-sm font-medium group-hover:text-foreground text-muted-foreground transition-colors">Active</span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            name="isBestSeller"
                            className="w-4 h-4 rounded border-primary text-primary focus:ring-primary"
                            defaultChecked={editingProduct?.isBestSeller}
                          />
                          <span className="text-sm font-medium group-hover:text-foreground text-muted-foreground transition-colors">Best Seller</span>
                        </label>
                      </div>

                      {/* Submit */}
                      <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                        <Button type="button" variant="ghost" onClick={closeForm} size="sm">Cancel</Button>
                        <Button type="submit" className="bg-primary px-6" size="sm">
                          {editingProduct ? "Save Changes" : "Create Product"}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ============ PRODUCTS TABLE ============ */}
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-secondary/30">
                      <TableRow>
                        <TableHead className="font-semibold">Product</TableHead>
                        <TableHead className="font-semibold">Price</TableHead>
                        <TableHead className="font-semibold">Category</TableHead>
                        <TableHead className="font-semibold">Stock</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productsLoading ? (
                        [...Array(3)].map((_, i) => (
                          <TableRow key={i}>
                            <TableCell colSpan={6}><div className="h-12 bg-muted animate-pulse rounded" /></TableCell>
                          </TableRow>
                        ))
                      ) : products?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">No products yet</p>
                            <p className="text-sm">Click "Add Product" to create your first product.</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        products?.map(product => {
                          const stockQty = product.quantityAvailable ?? 0;
                          return (
                            <TableRow key={product.id} className="hover:bg-secondary/10 transition-colors group">
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-muted border border-border/30 shrink-0" />
                                  ) : (
                                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                      <Package className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <p className="font-semibold text-sm truncate max-w-[180px]">
                                      {product.name}
                                      {product.isBestSeller && <span className="ml-2 text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full uppercase font-bold">⭐ Best</span>}
                                    </p>
                                    {product.description && (
                                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">{product.description}</p>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">{product.price} EGP</TableCell>
                              <TableCell>
                                <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-full">{product.scentType}</span>
                              </TableCell>
                              <TableCell>{getStockBadge(stockQty)}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={product.isActive === 'true'
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-gray-100 text-gray-600 border-gray-200"
                                  }
                                >
                                  {product.isActive === 'true' ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-end gap-1">
                                  <Button size="sm" variant="ghost" onClick={() => {
                                    setEditingProduct(product);
                                    setIsAdding(false);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }} className="h-8 w-8 p-0 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <Pencil className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 opacity-60 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all" onClick={() => {
                                    if (confirm("Delete this product? This action cannot be undone.")) deleteProduct.mutate(product.id);
                                  }}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== ORDERS TAB ==================== */}
          <TabsContent value="orders" className="animate-in fade-in-50 duration-200">
            <Card className="border-border/50">
              <CardHeader className="pb-4 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Orders</CardTitle>
                    <CardDescription>{totalOrdersCount} total orders • {pendingOrdersCount} pending</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-secondary/30">
                      <TableRow>
                        <TableHead className="font-semibold w-[80px]">Order</TableHead>
                        <TableHead className="font-semibold">Customer</TableHead>
                        <TableHead className="font-semibold">Items</TableHead>
                        <TableHead className="font-semibold">Total</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold text-right">Update</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ordersLoading ? (
                        [...Array(3)].map((_, i) => (
                          <TableRow key={i}>
                            <TableCell colSpan={6}><div className="h-12 bg-muted animate-pulse rounded" /></TableCell>
                          </TableRow>
                        ))
                      ) : orders?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                            <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">No orders yet</p>
                            <p className="text-sm">Orders will appear here once customers place them.</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        orders?.map(order => (
                          <>
                            <TableRow key={order.id} className="hover:bg-secondary/10 transition-colors cursor-pointer group" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                              <TableCell className="font-mono text-sm font-bold text-primary">
                                #{order.id.toString().padStart(4, '0')}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-sm">{order.user?.name}</span>
                                  <span className="text-xs text-muted-foreground">{order.user?.phone || order.user?.email}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm font-medium">{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}</span>
                              </TableCell>
                              <TableCell className="font-bold text-sm">{Number(order.totalAmount).toFixed(0)} EGP</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={statusColors[order.status] || ""}>
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                <Select
                                  onValueChange={(val) => handleUpdateStatus(order.id, val)}
                                  defaultValue={order.status}
                                >
                                  <SelectTrigger className="w-[130px] ml-auto h-8 text-xs bg-background">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent position="popper" sideOffset={4} className="z-[9999]">
                                    <SelectItem value="PENDING">⏳ Pending</SelectItem>
                                    <SelectItem value="CONFIRMED">✅ Confirmed</SelectItem>
                                    <SelectItem value="SHIPPED">📦 Shipped</SelectItem>
                                    <SelectItem value="DELIVERED">🎉 Delivered</SelectItem>
                                    <SelectItem value="CANCELLED">❌ Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>

                            {/* Expanded Order Details */}
                            {expandedOrder === order.id && (
                              <TableRow key={`details-${order.id}`}>
                                <TableCell colSpan={6} className="bg-secondary/20 border-b border-border/30">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-3 px-2">
                                    {/* Customer Details */}
                                    <div className="space-y-2">
                                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Customer Info</h4>
                                      <div className="space-y-1.5 text-sm">
                                        <div className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-muted-foreground" /> {order.user?.name}</div>
                                        {order.user?.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-muted-foreground" /> {order.user?.email}</div>}
                                        {order.user?.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-muted-foreground" /> {order.user?.phone}</div>}
                                        <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-muted-foreground" /> {order.city}, {order.address}</div>
                                        {order.createdAt && <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-muted-foreground" /> {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>}
                                      </div>
                                    </div>

                                    {/* Items */}
                                    <div>
                                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Order Items</h4>
                                      <div className="space-y-2">
                                        {order.items?.map((item: any, i: number) => (
                                          <div key={i} className="flex items-center justify-between text-sm bg-background rounded-lg px-3 py-2 border border-border/30">
                                            <div className="flex items-center gap-2">
                                              {item.product?.imageUrl && (
                                                <img src={item.product.imageUrl} alt="" className="w-8 h-8 rounded object-cover bg-muted" />
                                              )}
                                              <div>
                                                <p className="font-medium text-xs">{item.product?.name || "Product"}</p>
                                                <p className="text-[11px] text-muted-foreground">{item.quantity}x @ {item.priceAtPurchase} EGP</p>
                                              </div>
                                            </div>
                                            <span className="font-bold text-xs">{Number(item.priceAtPurchase) * item.quantity} EGP</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

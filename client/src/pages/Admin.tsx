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
  TrendingUp,
  DollarSign,
  Activity,
  LogOut
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

  // Sync scentType when switching between add/edit
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

    // Map to the new schema
    const productData = {
      name: data.name as string,
      description: data.description as string,
      price: data.price as string,
      scentType: data.scentType as string,
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

  // Stats calculation
  const totalRevenue = orders?.reduce((acc, order) => {
    if (order.status !== 'CANCELLED') {
      return acc + Number(order.totalAmount);
    }
    return acc;
  }, 0) || 0;

  const activeProductsCount = products?.filter(p => p.isActive === 'true').length || 0;
  const totalOrdersCount = orders?.length || 0;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-primary">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your store, inventory, and orders seamlessly.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground hidden sm:block">
              Logged in as <span className="text-foreground font-bold">{user?.name}</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              className="border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={() => logoutMutation.mutate(undefined, {
                onSuccess: () => setLocation("/auth")
              })}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold">{totalRevenue.toFixed(2)} EGP</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-xl text-accent">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Products</p>
                <h3 className="text-2xl font-bold">{activeProductsCount}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-xl text-green-600">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <h3 className="text-2xl font-bold">{totalOrdersCount}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="inventory" className="space-y-8">
          <TabsList className="bg-secondary/50 border border-border/50 p-1 rounded-xl w-full max-w-md grid grid-cols-2">
            <TabsTrigger value="inventory" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <Package className="w-4 h-4 mr-2" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
          </TabsList>

          {/* INVENTORY TAB */}
          <TabsContent value="inventory" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
            <Card className="border-border/50 shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                <div>
                  <CardTitle className="text-2xl">Product Management</CardTitle>
                  <CardDescription>View, edit, or add beautifully crafted products.</CardDescription>
                </div>
                <Button onClick={() => { setIsAdding(true); setEditingProduct(null); }} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </CardHeader>
              <CardContent className="pt-6">

                {/* Add/Edit Form */}
                {(isAdding || editingProduct) && (
                  <div className="mb-8 p-6 bg-secondary/20 border border-border/50 rounded-xl animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Pencil className="w-4 h-4 text-primary" />
                        {editingProduct ? "Edit Product details" : "Create New Product"}
                      </h3>
                    </div>

                    <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input name="name" defaultValue={editingProduct?.name} required placeholder="e.g. Midnight Oud" className="bg-background" />
                      </div>

                      <div className="space-y-2">
                        <Label>Price (EGP)</Label>
                        <Input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required placeholder="0.00" className="bg-background" />
                      </div>

                      {!editingProduct && (
                        <div className="space-y-2">
                          <Label>Initial Stock</Label>
                          <Input name="initialQuantity" type="number" defaultValue="0" min="0" required className="bg-background" />
                        </div>
                      )}



                      <div className="space-y-2 lg:col-span-2">
                        <Label>Scent Type</Label>
                        <Select
                          value={scentType}
                          onValueChange={setScentType}
                        >
                          <SelectTrigger className="bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Refreshing">Refreshing</SelectItem>
                            <SelectItem value="Floral">Floral</SelectItem>
                            <SelectItem value="Woody">Woody</SelectItem>
                            <SelectItem value="Oriental">Oriental</SelectItem>
                            <SelectItem value="Neutral">Neutral</SelectItem>
                          </SelectContent>
                        </Select>
                        <input type="hidden" name="scentType" value={scentType} />
                      </div>

                      <div className="space-y-2 lg:col-span-1">
                        <Label>Image URL</Label>
                        <Input name="imageUrl" defaultValue={editingProduct?.imageUrl} required placeholder="https://..." className="bg-background" />
                      </div>

                      <div className="flex items-center gap-6 pt-8 md:col-span-2 lg:col-span-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            name="isActive"
                            id="isActive"
                            className="w-5 h-5 rounded border-primary text-primary focus:ring-primary"
                            defaultChecked={editingProduct ? editingProduct.isActive === 'true' : true}
                          />
                          <Label htmlFor="isActive" className="cursor-pointer">Active Product</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            name="isBestSeller"
                            id="isBestSeller"
                            className="w-5 h-5 rounded border-primary text-primary focus:ring-primary"
                            defaultChecked={editingProduct?.isBestSeller}
                          />
                          <Label htmlFor="isBestSeller" className="cursor-pointer">Best Seller Badge</Label>
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2 lg:col-span-3">
                        <Label>Description</Label>
                        <Input name="description" defaultValue={editingProduct?.description} placeholder="A short description of the notes and experience..." className="bg-background" />
                      </div>

                      <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3 pt-4 border-t border-border/50">
                        <Button type="button" variant="outline" onClick={() => { setEditingProduct(null); setIsAdding(false); }}>Cancel</Button>
                        <Button type="submit" className="bg-primary">{editingProduct ? "Save Changes" : "Create Product"}</Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Table */}
                <div className="rounded-md border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-secondary/30">
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productsLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading products...</TableCell>
                        </TableRow>
                      ) : products?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No products found.</TableCell>
                        </TableRow>
                      ) : (
                        products?.map(product => (
                          <TableRow key={product.id} className="hover:bg-secondary/10 transition-colors">
                            <TableCell className="font-medium flex items-center gap-3">
                              {product.imageUrl && (
                                <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-md object-cover bg-muted flex-shrink-0" />
                              )}
                              <div>
                                {product.name}
                                {product.isBestSeller && <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase font-bold">Best Seller</span>}
                                {product.description && <p className="text-xs text-muted-foreground truncate max-w-[150px]">{product.description}</p>}
                              </div>
                            </TableCell>
                            <TableCell>{product.price} EGP</TableCell>
                            <TableCell>{product.scentType}</TableCell>
                            <TableCell>
                              <Badge variant={product.isActive === 'true' ? "default" : "secondary"} className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                                {product.isActive === 'true' ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="ghost" onClick={() => {
                                  setEditingProduct(product);
                                  setIsAdding(false);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }} className="h-8 w-8 p-0">
                                  <Pencil className="w-4 h-4 text-primary" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive" onClick={() => {
                                  if (confirm("Are you sure you want to delete this product?")) deleteProduct.mutate(product.id);
                                }}>
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ORDERS TAB */}
          <TabsContent value="orders" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
            <Card className="border-border/50 shadow-soft">
              <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="text-2xl">Order Tracking</CardTitle>
                <CardDescription>Track and update the fulfillment status of user purchases.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="rounded-md border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-secondary/30">
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ordersLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading orders...</TableCell>
                        </TableRow>
                      ) : orders?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No orders yet.</TableCell>
                        </TableRow>
                      ) : (
                        orders?.map(order => (
                          <TableRow key={order.id} className="hover:bg-secondary/10 transition-colors">
                            <TableCell className="font-medium">#{order.id.toString().padStart(4, '0')}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-semibold">{order.user?.name}</span>
                                <span className="text-xs text-muted-foreground">{order.user?.email}</span>
                                <span className="text-xs text-muted-foreground block max-w-[200px] truncate mt-1">
                                  {order.shippingAddress}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-bold text-primary">{Number(order.totalAmount).toFixed(2)} EGP</TableCell>
                            <TableCell>
                              <div className="text-xs space-y-1">
                                {order.items?.map((item: any, i: number) => (
                                  <div key={i} className="flex gap-1 items-center">
                                    <span className="font-semibold">{item.quantity}x</span>
                                    <span className="truncate max-w-[120px]">{item.product?.name || "Product"}</span>
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`
                                ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                                ${order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
                                ${order.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border-amber-200' : ''}
                                ${order.status === 'CONFIRMED' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : ''}
                                ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 border-red-200' : ''}
                              `}>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Select
                                onValueChange={(val) => handleUpdateStatus(order.id, val)}
                                defaultValue={order.status}
                              >
                                <SelectTrigger className="w-32 ml-auto h-8 text-xs bg-background">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="PENDING">Pending</SelectItem>
                                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
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

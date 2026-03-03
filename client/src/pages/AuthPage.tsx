import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
    const { user, loginMutation } = useAuth();
    const [, setLocation] = useLocation();

    useEffect(() => {
        if (user) {
            if (user.role === "ADMIN") {
                setLocation("/admin");
            } else {
                setLocation("/");
            }
        }
    }, [user, setLocation]);

    const loginForm = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    if (user) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl items-center">
                <div className="space-y-6">
                    <h1 className="text-4xl font-display font-bold text-primary">Air Bliss</h1>
                    <p className="text-xl text-muted-foreground">
                        Experience the finest collection of luxury fragrances.
                        Manage your orders and explore our premium scent categories.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-secondary/20 rounded-xl border border-border/50">
                            <h3 className="font-bold text-primary">Luxury Items</h3>
                            <p className="text-sm text-muted-foreground">Exclusive scents for exclusive clients.</p>
                        </div>
                        <div className="p-4 bg-secondary/20 rounded-xl border border-border/50">
                            <h3 className="font-bold text-primary">Fast Delivery</h3>
                            <p className="text-sm text-muted-foreground">Right to your doorstep overnight.</p>
                        </div>
                    </div>
                </div>

                <Card className="border-border/50 shadow-soft">
                    <CardHeader>
                        <CardTitle>Welcome to Air Bliss</CardTitle>
                        <CardDescription>Login or create an account to continue.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={loginForm.handleSubmit((data) =>
                                loginMutation.mutate(data)
                            )}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="login-email">Email</Label>
                                <Input id="login-email" type="email" {...loginForm.register("email")} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="login-password">Password</Label>
                                <Input id="login-password" type="password" {...loginForm.register("password")} required />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Login
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

import { useState, useMemo } from "react";
import { ProductCategory } from "@/types/product";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type SortOption = "price-low" | "price-high" | "newest" | "popular";

const Shop = () => {
  const { data: products = [], isLoading, error } = useProducts();
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [sortBy, setSortBy] = useState<SortOption>("popular");

  const categories: ProductCategory[] = ["Serums", "Toners", "Creams", "Cleansers"];
  
  const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.priceNumber)) : 1000000;
  const minPrice = products.length > 0 ? Math.min(...products.map(p => p.priceNumber)) : 0;

  const toggleCategory = (category: ProductCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([minPrice, maxPrice]);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const priceMatch = product.priceNumber >= priceRange[0] && product.priceNumber <= priceRange[1];
      return categoryMatch && priceMatch;
    });

    // Sort products
    const sorted = [...filtered];
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.priceNumber - b.priceNumber);
        break;
      case "price-high":
        sorted.sort((a, b) => b.priceNumber - a.priceNumber);
        break;
      case "newest":
      case "popular":
      default:
        // Keep original order for popular items
        break;
    }

    return sorted;
  }, [products, selectedCategories, priceRange, sortBy]);

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => toggleCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={maxPrice || 1000000}
            min={minPrice || 0}
            step={1000}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{priceRange[0].toLocaleString()}₮</span>
            <span>{priceRange[1].toLocaleString()}₮</span>
          </div>
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Clear Filters
      </Button>
    </div>
  );

  const ProductsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-24" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Shop All Products</h1>
          <p className="text-muted-foreground">Discover our complete K-Beauty collection</p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-4">
              <FilterSidebar />
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden fixed bottom-4 right-4 z-50">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="lg" className="rounded-full shadow-lg">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                {isLoading ? "Loading..." : `${filteredAndSortedProducts.length} ${filteredAndSortedProducts.length === 1 ? 'product' : 'products'}`}
              </p>
              
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-[200px] bg-background">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <ProductsSkeleton />
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Failed to load products. Please try again later.</p>
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your filters.</p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    image={product.image}
                    name={product.name}
                    brand={product.brand}
                    price={product.price}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;

import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import BlogCard from "./BlogCard";

interface BlogListProps {
  limit?: number;
  category?: string;
}

const BlogList = ({ limit, category }: BlogListProps) => {
  const { data: blogPosts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });
  
  // Filter posts by category if specified
  const filteredPosts = category 
    ? blogPosts?.filter(post => post.category === category)
    : blogPosts;
  
  // Limit the number of posts if specified
  const displayedPosts = limit && filteredPosts 
    ? filteredPosts.slice(0, limit) 
    : filteredPosts;
  
  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(limit || 3)].map((_, i) => (
          <div key={i} className="bg-secondary rounded-xl overflow-hidden shadow-lg">
            <Skeleton className="h-48 w-full" />
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Skeleton className="h-4 w-16" />
                <span className="mx-2 text-gray-400">•</span>
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center text-red-500 my-8">
        <p>Blog yazıları yüklenirken bir hata oluştu.</p>
        <p className="text-sm mt-2">Lütfen daha sonra tekrar deneyin.</p>
      </div>
    );
  }
  
  if (!displayedPosts || displayedPosts.length === 0) {
    return (
      <div className="text-center my-8">
        <p className="text-muted-foreground">
          {category 
            ? `"${category}" kategorisinde henüz blog yazısı bulunmuyor.` 
            : "Henüz blog yazısı bulunmuyor."}
        </p>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {displayedPosts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </motion.div>
  );
};

export default BlogList;

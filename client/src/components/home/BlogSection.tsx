import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import BlogCard from "@/components/blog/BlogCard";

const BlogSection = () => {
  const { data: blogPosts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-heading font-bold relative inline-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="relative z-10">Son Blog Yazıları</span>
            <span className="absolute bottom-0 left-0 w-full h-3 bg-primary bg-opacity-30 -z-10"></span>
          </motion.h2>
          <motion.p 
            className="text-lg mt-4 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Astrolojiye dair en güncel makaleler, burç analizleri ve kozmik olaylar hakkında bilgiler.
          </motion.p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
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
        ) : error ? (
          <div className="text-center text-red-500">
            Blog yazıları yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {blogPosts?.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </motion.div>
        )}
        
        <div className="text-center mt-12">
          <Link href="/blog">
            <motion.div 
              className="inline-block px-6 py-3 border border-accent text-accent hover:bg-accent hover:text-secondary rounded-full transition-all cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Tüm Yazıları Görüntüle
              <ArrowRight className="inline ml-2 h-4 w-4" />
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

import { Link } from "wouter";
import { BlogPost } from "@shared/schema";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  // Format date to "X time ago" format
  const formattedDate = formatDistanceToNow(new Date(post.publishedAt), {
    addSuffix: true,
    locale: tr
  });
  
  return (
    <motion.article 
      className="bg-secondary rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
      variants={cardVariants}
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="block h-48 overflow-hidden cursor-pointer">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
          />
        </div>
      </Link>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <span className="text-xs text-accent">{formattedDate}</span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-xs text-muted-foreground">{post.category}</span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <div className="block cursor-pointer">
            <h3 className="text-xl font-heading font-bold mb-3 hover:text-accent transition-colors">{post.title}</h3>
          </div>
        </Link>
        <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
        <Link href={`/blog/${post.slug}`}>
          <div className="text-accent hover:underline inline-flex items-center group cursor-pointer">
            <span>Devamını Oku</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>
    </motion.article>
  );
};

export default BlogCard;

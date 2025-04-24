import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import BlogList from "@/components/blog/BlogList";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  const { data: blogPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });
  
  // Extract unique categories from blog posts
  const categories = blogPosts 
    ? ["all", ...new Set(blogPosts.map(post => post.category))]
    : ["all"];
  
  // Filter posts based on search term
  const filteredPosts = blogPosts?.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <motion.main 
      className="pt-24 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Blog</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Astroloji hakkında güncel yazılar, burç yorumları, gökyüzü olayları ve daha fazlası.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Blog yazılarında ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {searchTerm ? (
          <div className="mb-6">
            <h2 className="text-2xl font-heading mb-6">Arama Sonuçları: "{searchTerm}"</h2>
            {filteredPosts?.length ? (
              <BlogList />
            ) : (
              <p className="text-center text-muted-foreground">
                Aramanıza uygun yazı bulunamadı.
              </p>
            )}
          </div>
        ) : (
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
            <div className="mb-8 overflow-x-auto">
              <TabsList className="w-full justify-start">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="text-sm py-2 px-4"
                  >
                    {category === "all" ? "Tümü" : category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <TabsContent value="all">
              <h2 className="text-2xl font-heading mb-6">Tüm Yazılar</h2>
              <BlogList />
            </TabsContent>
            
            {categories.filter(c => c !== "all").map((category) => (
              <TabsContent key={category} value={category}>
                <h2 className="text-2xl font-heading mb-6">{category} Yazıları</h2>
                <BlogList category={category} />
              </TabsContent>
            ))}
          </Tabs>
        )}
        
        <motion.div 
          className="mt-16 max-w-4xl mx-auto bg-secondary p-8 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-heading font-bold mb-4">Neden Astroloji Blogumuzu Takip Etmelisiniz?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="mb-4">
                Uzman astrologlarımız, en güncel gökyüzü olayları, gezegen transitleri ve bunların yaşamınıza 
                olası etkileri hakkında derinlemesine analizler sunar. Amacımız, astrolojiyi anlaşılır ve 
                uygulanabilir bir şekilde sizlere aktarmaktır.
              </p>
              <p>
                Yeni dolunay ve dolunay döngüleri, günlük, haftalık ve aylık burç yorumları, 
                gezegen retroları ve daha fazlası ile gökyüzünün rehberliğinde yaşamınızı daha 
                bilinçli bir şekilde yönlendirmenize destek oluyoruz.
              </p>
            </div>
            <div>
              <p className="mb-4">
                Ayrıca, astrolojinin farklı dalları, doğum haritası incelikleri, astro-psikoloji, 
                mitoloji ve sembolizm gibi konularda da eğitici içerikler bulabilirsiniz.
              </p>
              <p>
                Blogumuza abone olarak, yeni içeriklerimizden haberdar olabilir, 
                astrolojik gelişmeleri yakından takip edebilir ve yorumlarınızla 
                tartışmalara katılabilirsiniz. Kozmik bilgeliğin yolculuğunda 
                sizlere eşlik etmekten mutluluk duyuyoruz.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
};

export default Blog;

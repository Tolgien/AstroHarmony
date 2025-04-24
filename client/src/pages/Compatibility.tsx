import { motion } from "framer-motion";
import CompatibilityChecker from "@/components/compatibility/CompatibilityChecker";

const Compatibility = () => {
  return (
    <motion.main 
      className="pt-24 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Burç Uyumu</h1>
          <p className="text-lg max-w-2xl mx-auto">
            İki burcun aşk, arkadaşlık ve iş hayatındaki uyumunu öğrenin. Burçlar arasındaki ilişkileri 
            anlayarak daha derin bağlar kurabilirsiniz.
          </p>
        </div>
        
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CompatibilityChecker />
        </motion.div>
        
        <motion.div 
          className="max-w-4xl mx-auto mt-16 grid md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-secondary p-6 rounded-xl">
            <h2 className="text-xl font-heading font-bold mb-4">Element Uyumları</h2>
            <div className="space-y-4">
              <div className="p-3 bg-background rounded-lg">
                <h3 className="font-heading text-accent mb-1">Ateş (Koç, Aslan, Yay)</h3>
                <p className="text-sm">
                  Ateş burçları birbirleriyle ve Hava burçlarıyla iyi anlaşır. Enerji ve tutkularını paylaşırlar. 
                  Su burçlarıyla zorluklar yaşayabilirler.
                </p>
              </div>
              
              <div className="p-3 bg-background rounded-lg">
                <h3 className="font-heading text-accent mb-1">Toprak (Boğa, Başak, Oğlak)</h3>
                <p className="text-sm">
                  Toprak burçları birbirleriyle ve Su burçlarıyla uyumludur. Pratiklik ve güvenilirliğe değer verirler. 
                  Hava burçlarıyla anlaşmaları zor olabilir.
                </p>
              </div>
              
              <div className="p-3 bg-background rounded-lg">
                <h3 className="font-heading text-accent mb-1">Hava (İkizler, Terazi, Kova)</h3>
                <p className="text-sm">
                  Hava burçları birbirleriyle ve Ateş burçlarıyla iyi anlaşır. İletişim ve entelektüel konularda uyumludurlar. 
                  Toprak burçlarıyla zorlanabilirler.
                </p>
              </div>
              
              <div className="p-3 bg-background rounded-lg">
                <h3 className="font-heading text-accent mb-1">Su (Yengeç, Akrep, Balık)</h3>
                <p className="text-sm">
                  Su burçları birbirleriyle ve Toprak burçlarıyla uyumludur. Duygusal anlayış ve sezgiselliği paylaşırlar. 
                  Ateş burçlarıyla ilişkileri zorlayıcı olabilir.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-secondary p-6 rounded-xl">
            <h2 className="text-xl font-heading font-bold mb-4">Karşıt Burçlar</h2>
            <p className="mb-4">
              Zodyak'ta karşıt burçlar genellikle güçlü bir çekim yaşarlar, çünkü birbirlerini tamamlayıcı özelliklere sahiptirler. 
              Bu karşıtlık hem büyük bir uyum hem de büyük zorluklar yaratabilir.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-background rounded-lg text-center">
                <p className="font-heading mb-1">Koç ⟷ Terazi</p>
                <p className="text-xs text-muted-foreground">Ben ⟷ Biz</p>
              </div>
              <div className="p-3 bg-background rounded-lg text-center">
                <p className="font-heading mb-1">Boğa ⟷ Akrep</p>
                <p className="text-xs text-muted-foreground">Madde ⟷ Duygu</p>
              </div>
              <div className="p-3 bg-background rounded-lg text-center">
                <p className="font-heading mb-1">İkizler ⟷ Yay</p>
                <p className="text-xs text-muted-foreground">Veri ⟷ Anlam</p>
              </div>
              <div className="p-3 bg-background rounded-lg text-center">
                <p className="font-heading mb-1">Yengeç ⟷ Oğlak</p>
                <p className="text-xs text-muted-foreground">Ev ⟷ Karİyer</p>
              </div>
              <div className="p-3 bg-background rounded-lg text-center">
                <p className="font-heading mb-1">Aslan ⟷ Kova</p>
                <p className="text-xs text-muted-foreground">Birey ⟷ Toplum</p>
              </div>
              <div className="p-3 bg-background rounded-lg text-center">
                <p className="font-heading mb-1">Başak ⟷ Balık</p>
                <p className="text-xs text-muted-foreground">Analiz ⟷ Sentez</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="max-w-4xl mx-auto mt-8 bg-primary/20 p-6 rounded-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="italic">
            "Burç uyumu, ilişkileri anlamak için faydalı bir araçtır, ancak kişilerin doğum haritalarının 
            tamamı dikkate alındığında daha derinlemesine bir analiz sağlanır. Her ilişki, içindeki bireylerin 
            özgün kombinasyonu kadar benzersizdir."
          </p>
        </motion.div>
      </div>
    </motion.main>
  );
};

export default Compatibility;

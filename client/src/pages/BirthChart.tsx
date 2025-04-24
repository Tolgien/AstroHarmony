import { motion } from "framer-motion";
import BirthChartCalculator from "@/components/charts/BirthChartCalculator";

const BirthChart = () => {
  return (
    <motion.main 
      className="pt-24 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Doğum Haritası</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Doğum haritanız, doğduğunuz an gökyüzündeki gezegenlerin konumunu gösteren astrolojik haritadır. 
            Kişiliğiniz, yetenekleriniz ve hayat yolculuğunuzu anlamanıza yardımcı olur.
          </p>
        </div>
        
        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <BirthChartCalculator />
        </motion.div>
        
        <motion.div 
          className="max-w-4xl mx-auto mt-16 bg-secondary p-8 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-heading font-bold mb-4">Doğum Haritası Nedir ve Nasıl Yorumlanır?</h2>
          <div className="space-y-4">
            <p>
              Doğum haritası, astrolojide natal harita olarak da bilinir ve doğduğunuz an gökyüzündeki gezegenlerin, yıldızların ve diğer 
              göksel cisimlerin konumlarını gösteren bir haritadır. Bu kozmik anlık görüntü, kişiliğinizin, yeteneklerinizin, zorluklarınızın 
              ve hayat yolculuğunuzun bir yansımasıdır.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-heading text-lg mb-2 text-accent">Güneş, Ay ve Yükselen</h3>
                <p className="text-sm">
                  Haritanızdaki en önemli üç faktör şunlardır: Güneş burcu (temel benliğiniz), Ay burcu (duygusal doğanız) ve 
                  Yükselen burcunuz (diğerlerinin sizi nasıl gördüğü). Bu "büyük üçlü", kişiliğinizin temel yapı taşlarını oluşturur.
                </p>
              </div>
              
              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-heading text-lg mb-2 text-accent">Gezegenler ve Evler</h3>
                <p className="text-sm">
                  Her gezegen hayatınızın farklı bir yönünü temsil eder (örneğin, Venüs aşk ve ilişkiler, Mars tutku ve enerji). 
                  Bu gezegenler 12 "ev" içinde bulunur ve her ev yaşamınızın belirli bir alanını (örneğin kariyer, ilişkiler, sağlık) temsil eder.
                </p>
              </div>
            </div>
            
            <p>
              Doğum haritası yorumlanırken, sadece tek bir faktöre değil, tüm haritadaki desenlere, açılara ve ilişkilere bakılır. 
              Bu, neden aynı Güneş burcuna sahip insanların çok farklı olabileceğini açıklar - çünkü doğum haritası, milyonlarca olası 
              kombinasyonla son derece kişiselleştirilmiş bir haritadır.
            </p>
            
            <p>
              Doğru bir doğum haritası hesaplaması için doğum tarihinizi, saatinizi ve tam yerinizi bilmek önemlidir. Doğum saati 
              özellikle önemlidir çünkü yükselen burcunuzu ve ev konumlarını belirler.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
};

export default BirthChart;

import { Link } from "wouter";
import { motion } from "framer-motion";
import { ZodiacSign } from "@shared/schema";

interface ZodiacCardProps {
  sign: ZodiacSign;
}

const ZodiacCard = ({ sign }: ZodiacCardProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <motion.div variants={cardVariants}>
      <Link href={`/zodiac-signs/${sign.name.toLowerCase()}`}>
        <a className="zodiac-card bg-secondary bg-opacity-70 rounded-xl p-5 flex flex-col items-center text-center transition-all duration-300 block">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4">
            <span className="text-accent text-2xl" dangerouslySetInnerHTML={{ __html: sign.symbol }} />
          </div>
          <h3 className="text-lg font-heading font-semibold">{sign.name}</h3>
          <p className="text-sm text-muted-foreground mt-2">{sign.dateRange}</p>
        </a>
      </Link>
    </motion.div>
  );
};

export default ZodiacCard;

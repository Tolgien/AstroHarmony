import { 
  users, 
  type User, 
  type InsertUser,
  blogPosts,
  type BlogPost,
  type InsertBlogPost,
  zodiacSigns,
  type ZodiacSign,
  type InsertZodiacSign,
  contactMessages,
  type ContactMessage,
  type InsertContactMessage,
  birthCharts,
  type BirthChart,
  type InsertBirthChart,
  appointments,
  type Appointment,
  type InsertAppointment
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Blog methods
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  
  // Zodiac methods
  getAllZodiacSigns(): Promise<ZodiacSign[]>;
  getZodiacSignById(id: number): Promise<ZodiacSign | undefined>;
  getZodiacSignByName(name: string): Promise<ZodiacSign | undefined>;
  createZodiacSign(sign: InsertZodiacSign): Promise<ZodiacSign>;
  
  // Contact methods
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  
  // Birth Chart methods
  createBirthChart(chart: InsertBirthChart): Promise<BirthChart>;
  getBirthChartsByUserId(userId: number): Promise<BirthChart[]>;
  getBirthChartById(id: number): Promise<BirthChart | undefined>;
  
  // Appointment methods
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointmentsByUserId(userId: number): Promise<Appointment[]>;
  getAppointmentById(id: number): Promise<Appointment | undefined>;
  updateAppointmentStatus(id: number, confirmed: boolean, completed: boolean): Promise<Appointment | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private blogPosts: Map<number, BlogPost>;
  private zodiacSigns: Map<number, ZodiacSign>;
  private contactMessages: Map<number, ContactMessage>;
  private birthCharts: Map<number, BirthChart>;
  private appointments: Map<number, Appointment>;
  
  private userIdCounter: number;
  private blogPostIdCounter: number;
  private zodiacSignIdCounter: number;
  private contactMessageIdCounter: number;
  private birthChartIdCounter: number;
  private appointmentIdCounter: number;

  constructor() {
    this.users = new Map();
    this.blogPosts = new Map();
    this.zodiacSigns = new Map();
    this.contactMessages = new Map();
    this.birthCharts = new Map();
    this.appointments = new Map();
    
    this.userIdCounter = 1;
    this.blogPostIdCounter = 1;
    this.zodiacSignIdCounter = 1;
    this.contactMessageIdCounter = 1;
    this.birthChartIdCounter = 1;
    this.appointmentIdCounter = 1;
    
    // Initialize with zodiac signs data
    this.initializeZodiacSigns();
    // Initialize with some blog posts
    this.initializeBlogPosts();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      birthDate: null,
      birthTime: null,
      birthPlace: null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null
    };
    this.users.set(id, user);
    return user;
  }
  
  // Blog methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }
  
  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.slug === slug
    );
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostIdCounter++;
    const blogPost: BlogPost = { 
      ...post, 
      id, 
      publishedAt: post.publishedAt || new Date() 
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }
  
  // Zodiac methods
  async getAllZodiacSigns(): Promise<ZodiacSign[]> {
    return Array.from(this.zodiacSigns.values());
  }
  
  async getZodiacSignById(id: number): Promise<ZodiacSign | undefined> {
    return this.zodiacSigns.get(id);
  }
  
  async getZodiacSignByName(name: string): Promise<ZodiacSign | undefined> {
    return Array.from(this.zodiacSigns.values()).find(
      (sign) => sign.name.toLowerCase() === name.toLowerCase()
    );
  }
  
  async createZodiacSign(sign: InsertZodiacSign): Promise<ZodiacSign> {
    const id = this.zodiacSignIdCounter++;
    const zodiacSign: ZodiacSign = { ...sign, id };
    this.zodiacSigns.set(id, zodiacSign);
    return zodiacSign;
  }
  
  // Contact methods
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageIdCounter++;
    const contactMessage: ContactMessage = { ...message, id, createdAt: new Date() };
    this.contactMessages.set(id, contactMessage);
    return contactMessage;
  }
  
  // Birth Chart methods
  async createBirthChart(chart: InsertBirthChart): Promise<BirthChart> {
    const id = this.birthChartIdCounter++;
    const birthChart: BirthChart = { ...chart, id, createdAt: new Date() };
    this.birthCharts.set(id, birthChart);
    return birthChart;
  }
  
  async getBirthChartsByUserId(userId: number): Promise<BirthChart[]> {
    return Array.from(this.birthCharts.values())
      .filter((chart) => chart.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getBirthChartById(id: number): Promise<BirthChart | undefined> {
    return this.birthCharts.get(id);
  }
  
  // Appointment methods
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentIdCounter++;
    const newAppointment: Appointment = { 
      ...appointment, 
      id, 
      confirmed: false,
      completed: false,
      createdAt: new Date(),
      notes: appointment.notes || null
    };
    this.appointments.set(id, newAppointment);
    return newAppointment;
  }
  
  async getAppointmentsByUserId(userId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(appointment => appointment.userId === userId)
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
  }
  
  async getAppointmentById(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }
  
  async updateAppointmentStatus(id: number, confirmed: boolean, completed: boolean): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    
    const updatedAppointment: Appointment = {
      ...appointment,
      confirmed,
      completed
    };
    
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }
  
  // Initialize data
  private initializeZodiacSigns() {
    const zodiacData: InsertZodiacSign[] = [
      {
        name: "Koç",
        symbol: "♈",
        element: "Ateş",
        planet: "Mars",
        dateRange: "21 Mart - 19 Nisan",
        traits: "Enerjik, cesur, rekabetçi",
        strengths: "Liderlik, cesaret, heyecan",
        weaknesses: "Sabırsızlık, agresiflik, düşünmeden hareket etme",
        description: "Koç burcu, zodyak'ın ilk burcudur ve ilkbaharın başlangıcını temsil eder. Yönetici gezegeni Mars olan Koç burcu, ateş elementine aittir. Koç burçları genellikle enerjik, cesaretli ve maceracıdır. Liderlik vasıfları güçlüdür ve yeni girişimlere başlamakta ustadırlar. Ancak, sabırsız olabilir ve düşünmeden hareket edebilirler.",
        compatibility: "Aslan, Yay, İkizler, Kova",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Aries.svg"
      },
      {
        name: "Boğa",
        symbol: "♉",
        element: "Toprak",
        planet: "Venüs",
        dateRange: "20 Nisan - 20 Mayıs",
        traits: "Kararlı, güvenilir, duyusal",
        strengths: "Sabır, pratiklik, güvenilirlik",
        weaknesses: "İnatçılık, sahiplenmek, değişime direnç",
        description: "Boğa burcu, toprak elementine ait olup Venüs tarafından yönetilir. Boğa burçları genellikle kararlı, güvenilir ve pratiktir. Konfor, güvenlik ve istikrarı değerlendirirler. Doğal olarak estetik bir anlayışa sahiptirler ve güzel şeylerden keyif alırlar. Ancak, inatçı olabilirler ve değişime direnç gösterebilirler.",
        compatibility: "Başak, Oğlak, Yengeç, Balık",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/99/Taurus.svg"
      },
      {
        name: "İkizler",
        symbol: "♊",
        element: "Hava",
        planet: "Merkür",
        dateRange: "21 Mayıs - 20 Haziran",
        traits: "Meraklı, uyarlanabilir, sosyal",
        strengths: "İletişim, zeka, uyarlanabilirlik",
        weaknesses: "Kararsızlık, yüzeysellik, dikkat dağınıklığı",
        description: "İkizler burcu, hava elementine aittir ve Merkür tarafından yönetilir. İkizler burçları genellikle meraklı, sosyal ve uyarlanabilirdir. Mükemmel iletişimcilerdir ve yeni fikirler ve deneyimler için her zaman açıktırlar. Ancak, kararsız olabilirler ve odaklanmakta zorlanabilirler.",
        compatibility: "Terazi, Kova, Koç, Aslan",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Gemini.svg"
      },
      {
        name: "Yengeç",
        symbol: "♋",
        element: "Su",
        planet: "Ay",
        dateRange: "21 Haziran - 22 Temmuz",
        traits: "Duygusal, koruyucu, sezgisel",
        strengths: "Şefkat, sadakat, duyarlılık",
        weaknesses: "Değişken ruh hali, aşırı duygusallık, manipülatif olabilme",
        description: "Yengeç burcu, su elementine aittir ve Ay tarafından yönetilir. Yengeç burçları genellikle duygusal, sezgisel ve koruyucudur. Aile ve ev onlar için çok önemlidir. Genellikle empatiktirler ve başkalarının duygularını anlama konusunda doğal bir yeteneğe sahiptirler. Ancak, değişken ruh halleri olabilir ve aşırı duyarlı olabilirler.",
        compatibility: "Akrep, Balık, Boğa, Başak",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/10/Cancer.svg"
      },
      {
        name: "Aslan",
        symbol: "♌",
        element: "Ateş",
        planet: "Güneş",
        dateRange: "23 Temmuz - 22 Ağustos",
        traits: "Gururlu, cömert, yaratıcı",
        strengths: "Güçlü irade, karizma, liderlik",
        weaknesses: "Kibir, baskınlık, ihtişam düşkünlüğü",
        description: "Aslan burcu, ateş elementine aittir ve Güneş tarafından yönetilir. Aslan burçları genellikle özgüvenli, cömert ve yaratıcıdır. Doğal liderlerdir ve dikkat çekmeyi severler. Tutkuludurlar ve hayatlarını büyük bir coşkuyla yaşarlar. Ancak, kibir gösterebilirler ve baskın olabilirler.",
        compatibility: "Koç, Yay, İkizler, Terazi",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/99/Leo.svg"
      },
      {
        name: "Başak",
        symbol: "♍",
        element: "Toprak",
        planet: "Merkür",
        dateRange: "23 Ağustos - 22 Eylül",
        traits: "Analitik, pratik, mükemmeliyetçi",
        strengths: "Titizlik, zeka, problem çözme",
        weaknesses: "Eleştirellik, aşırı endişe, dış dünyaya kapalılık",
        description: "Başak burcu, toprak elementine aittir ve Merkür tarafından yönetilir. Başak burçları genellikle analitik, pratik ve düzenlidir. Detaylara büyük önem verirler ve problem çözmede ustadırlar. Yardımsever ve sadıktırlar. Ancak, aşırı eleştirel olabilirler ve fazla endişelenme eğilimindedirler.",
        compatibility: "Boğa, Oğlak, Yengeç, Akrep",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Virgo.svg"
      },
      {
        name: "Terazi",
        symbol: "♎",
        element: "Hava",
        planet: "Venüs",
        dateRange: "23 Eylül - 22 Ekim",
        traits: "Diplomatik, adil, sosyal",
        strengths: "Diplomatik yetenek, uyum, denge",
        weaknesses: "Kararsızlık, yüzeysellik, çatışmadan kaçınma",
        description: "Terazi burcu, hava elementine aittir ve Venüs tarafından yönetilir. Terazi burçları genellikle diplomatik, adil ve sosyaldir. Denge ve uyuma değer verirler. Güzellik, sanat ve estetiğe doğal bir çekimleri vardır. Ancak, kararsız olabilirler ve çatışmadan kaçınabilirler.",
        compatibility: "İkizler, Kova, Aslan, Yay",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Libra.svg"
      },
      {
        name: "Akrep",
        symbol: "♏",
        element: "Su",
        planet: "Plüton",
        dateRange: "23 Ekim - 21 Kasım",
        traits: "Yoğun, tutkulu, kararlı",
        strengths: "Kararlılık, cesaret, sezgisellik",
        weaknesses: "Kıskançlık, obsesiflik, kontrolcülük",
        description: "Akrep burcu, su elementine aittir ve Plüton tarafından yönetilir. Akrep burçları genellikle yoğun, tutkulu ve kararlıdır. Büyük bir iç güce ve sezgisel anlayışa sahiptirler. Sadık ve koruyucudurlar. Ancak, kıskanç ve kontrolcü olabilirler ve intikamcı bir tarafları vardır.",
        compatibility: "Yengeç, Balık, Başak, Oğlak",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Scorpio.svg"
      },
      {
        name: "Yay",
        symbol: "♐",
        element: "Ateş",
        planet: "Jüpiter",
        dateRange: "22 Kasım - 21 Aralık",
        traits: "İyimser, özgürlük sever, felsefi",
        strengths: "İyimserlik, dürüstlük, macera ruhu",
        weaknesses: "Taktısızlık, sabırsızlık, bağlanamama",
        description: "Yay burcu, ateş elementine aittir ve Jüpiter tarafından yönetilir. Yay burçları genellikle iyimser, dürüst ve maceraperesttir. Özgürlüğü ve yeni deneyimleri severler. Felsefeye, eğitime ve büyük düşünmeye doğal bir eğilimleri vardır. Ancak, taktlar olabilirler ve bağlanmakta zorlanabilirler.",
        compatibility: "Koç, Aslan, İkizler, Terazi",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/80/Sagittarius.svg"
      },
      {
        name: "Oğlak",
        symbol: "♑",
        element: "Toprak",
        planet: "Satürn",
        dateRange: "22 Aralık - 19 Ocak",
        traits: "Disiplinli, sorumlu, geleneksel",
        strengths: "Disiplin, sorumluluk, pratiklik",
        weaknesses: "Katılık, pesimizm, aşırı iş odaklılık",
        description: "Oğlak burcu, toprak elementine aittir ve Satürn tarafından yönetilir. Oğlak burçları genellikle disiplinli, sorumlu ve hırslıdır. Pratiktirler ve hedeflerine ulaşmak için sabırla çalışırlar. Geleneklere ve otoriteye saygı gösterirler. Ancak, katı ve pesimist olabilirler ve işlerine fazla odaklanabilirler.",
        compatibility: "Boğa, Başak, Akrep, Balık",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/76/Capricorn.svg"
      },
      {
        name: "Kova",
        symbol: "♒",
        element: "Hava",
        planet: "Uranüs",
        dateRange: "20 Ocak - 18 Şubat",
        traits: "Yenilikçi, bağımsız, hümanist",
        strengths: "Orijinallik, bağımsızlık, ileri görüşlülük",
        weaknesses: "Duygusal kopukluk, asi ruh, çelişki",
        description: "Kova burcu, hava elementine aittir ve Uranüs tarafından yönetilir. Kova burçları genellikle yenilikçi, ilerici ve bağımsızdır. Orijinal fikirler üretirler ve geleneksel olmayan yaklaşımlara değer verirler. İnsancıldırlar ve toplumsal konulara ilgi duyarlar. Ancak, duygusal olarak kopuk olabilirler ve fazla asi olabilirler.",
        compatibility: "İkizler, Terazi, Koç, Yay",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/24/Aquarius.svg"
      },
      {
        name: "Balık",
        symbol: "♓",
        element: "Su",
        planet: "Neptün",
        dateRange: "19 Şubat - 20 Mart",
        traits: "Duyarlı, hayalci, şefkatli",
        strengths: "Yaratıcılık, empati, sezgisellik",
        weaknesses: "Kurban psikolojisi, kaçış, belirsizlik",
        description: "Balık burcu, su elementine aittir ve Neptün tarafından yönetilir. Balık burçları genellikle empatik, hayalci ve sezgiseldir. Yaratıcı bir ruha sahiptirler ve duygusal derinlikleri vardır. Şefkatlidirler ve başkalarına yardım etmekten keyif alırlar. Ancak, gerçeklikten kaçma eğiliminde olabilirler ve kolayca kurban rolüne bürünebilirler.",
        compatibility: "Yengeç, Akrep, Boğa, Oğlak",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/95/Pisces.svg"
      }
    ];
    
    zodiacData.forEach(sign => {
      const id = this.zodiacSignIdCounter++;
      this.zodiacSigns.set(id, { ...sign, id });
    });
  }
  
  private initializeBlogPosts() {
    const blogData: InsertBlogPost[] = [
      {
        title: "Mars Retrosu ve Burçlara Etkileri",
        slug: "mars-retrosu-ve-burclara-etkileri",
        content: `<p>Mars gezegeninin retro döneminde burçların nasıl etkilendiğini ve bu dönemi en verimli şekilde nasıl geçirebileceğinizi anlattık.</p>
                  <h2>Mars Retrosu Nedir?</h2>
                  <p>Mars retrosu, Mars gezegeninin Dünya'dan bakıldığında geriye doğru hareket ediyormuş gibi göründüğü astronomik bir olaydır. Bu fiziksel bir geri hareket değil, optik bir yanılsamadır. Astrolojik açıdan, Mars retrosu enerjinin içe dönük bir şekilde yönlendirildiği, harekete geçmek yerine gözden geçirme ve yeniden değerlendirme zamanı olarak kabul edilir.</p>
                  <h2>Burçlara Etkileri</h2>
                  <h3>Ateş Burçları (Koç, Aslan, Yay)</h3>
                  <p>Ateş burçları için Mars retrosu oldukça zorlayıcı olabilir. Normalde ileri atılma, liderlik etme ve risk alma konusunda istekli olan bu burçlar, retro döneminde frustrasyon ve sabırsızlık yaşayabilirler. Bu süreçte enerjilerini içe dönük çalışmalara, kişisel projelere yönlendirmeleri daha faydalı olacaktır.</p>
                  <h3>Toprak Burçları (Boğa, Başak, Oğlak)</h3>
                  <p>Toprak burçları Mars retrosundan genellikle daha az etkilenir, ancak maddi konularda, iş hayatında ve fiziksel sağlıkta bazı aksaklıklar yaşayabilirler. Bu dönem, finansal planları gözden geçirmek ve sağlık rutinlerini iyileştirmek için ideal bir zamandır.</p>`,
        excerpt: "Mars gezegeninin retro döneminde burçların nasıl etkilendiğini ve bu dönemi en verimli şekilde nasıl geçirebileceğinizi anlattık.",
        imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        category: "Gezegenler",
        publishedAt: new Date("2023-09-12"),
        author: "Astro Uzmanı"
      },
      {
        title: "Dolunay Ritüelleri ve Enerjisini Kullanma",
        slug: "dolunay-rituelleri-ve-enerjisini-kullanma",
        content: `<p>Dolunay döneminde enerjinizi yükseltecek, hedeflerinize ulaşmanızı sağlayacak ritüeller ve meditasyon teknikleri.</p>
                  <h2>Dolunay Enerjisi</h2>
                  <p>Dolunay, Ay'ın döngüsünün en güçlü zamanıdır ve tamamlanma, hasat ve farkındalık enerjilerini temsil eder. Bu dönem, hedeflerinize ulaşmak, manifestasyon çalışmaları yapmak ve arınma ritüelleri gerçekleştirmek için mükemmel bir zamandır.</p>
                  <h2>Dolunay Ritüelleri</h2>
                  <h3>1. Ay Suyu Hazırlama</h3>
                  <p>Bir kase temiz suyu dolunay ışığının altına yerleştirin ve tüm gece boyunca orada bırakın. Bu "şarj olmuş" suyu çeşitli ritüellerde, bitkileri sulamak için veya evinizi temizlemek için kullanabilirsiniz.</p>
                  <h3>2. Şükran ve Niyet Listesi</h3>
                  <p>Dolunay zamanı, hem şükran duymak hem de artık hayatınızda istemediğiniz şeyleri serbest bırakmak için idealdir. Bir kağıda minnettar olduğunuz şeyleri yazın, ardından başka bir kağıda bırakmak istediğiniz alışkanlıkları, düşünceleri veya durumları yazın. İkinci kağıdı güvenli bir şekilde yakabilir veya gömebilirsiniz.</p>`,
        excerpt: "Dolunay döneminde enerjinizi yükseltecek, hedeflerinize ulaşmanızı sağlayacak ritüeller ve meditasyon teknikleri.",
        imageUrl: "https://images.unsplash.com/photo-1675461221513-bc94b2f3f8fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        category: "Ay Döngüsü",
        publishedAt: new Date("2023-09-05"),
        author: "Luna Bilge"
      },
      {
        title: "Venüs'ün Doğum Haritanızdaki Yeri ve Aşk Hayatınız",
        slug: "venusun-dogum-haritanizdaki-yeri-ve-ask-hayatiniz",
        content: `<p>Doğum haritanızda Venüs'ün konumu aşk hayatınız, ilişki tarzınız ve çekim gücünüz hakkında ne söylüyor?</p>
                  <h2>Venüs'ün Astrolojideki Önemi</h2>
                  <p>Venüs, astrolojide aşk, güzellik, değerler ve zevk gezegeni olarak bilinir. Doğum haritanızda Venüs'ün bulunduğu burç ve ev, romantik ilişkilerdeki tercihlerinizi, neyi çekici bulduğunuzu ve ilişkilerde nasıl davrandığınızı etkiler.</p>
                  <h2>Burçlarda Venüs</h2>
                  <h3>Koç Burcunda Venüs</h3>
                  <p>Venüs'ü Koç'ta olanlar, aşkta tutkulu, spontane ve doğrudandır. Heyecan verici, enerjik partnerlere çekilirler ve ilişkilerinde liderlik etmeyi severler. Ancak bazen sabırsız olabilir ve uzun süreli bağlılıkta zorluk yaşayabilirler.</p>
                  <h3>Boğa Burcunda Venüs</h3>
                  <p>Venüs'ü Boğa'da olanlar, güvenilir, sadık ve duyusal ilişkiler ararlar. Fiziksel temas, konfor ve güvenlik onlar için önemlidir. Romantik jestleri, lüksü ve güzel yemekleri takdir ederler. Ancak bazen aşırı sahiplenici olabilirler.</p>`,
        excerpt: "Doğum haritanızda Venüs'ün konumu aşk hayatınız, ilişki tarzınız ve çekim gücünüz hakkında ne söylüyor?",
        imageUrl: "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        category: "İlişkiler",
        publishedAt: new Date("2023-08-28"),
        author: "Venüs Yıldız"
      }
    ];
    
    blogData.forEach(post => {
      const id = this.blogPostIdCounter++;
      this.blogPosts.set(id, { ...post, id });
    });
  }
}

// Database Storage class
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Blog methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
  }
  
  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [blogPost] = await db.insert(blogPosts).values(post).returning();
    return blogPost;
  }
  
  // Zodiac methods
  async getAllZodiacSigns(): Promise<ZodiacSign[]> {
    return await db.select().from(zodiacSigns);
  }
  
  async getZodiacSignById(id: number): Promise<ZodiacSign | undefined> {
    const [sign] = await db.select().from(zodiacSigns).where(eq(zodiacSigns.id, id));
    return sign;
  }
  
  async getZodiacSignByName(name: string): Promise<ZodiacSign | undefined> {
    const [sign] = await db.select().from(zodiacSigns).where(eq(zodiacSigns.name, name));
    return sign;
  }
  
  async createZodiacSign(sign: InsertZodiacSign): Promise<ZodiacSign> {
    const [zodiacSign] = await db.insert(zodiacSigns).values(sign).returning();
    return zodiacSign;
  }
  
  // Contact methods
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [contactMessage] = await db.insert(contactMessages).values(message).returning();
    return contactMessage;
  }
  
  // Birth Chart methods
  async createBirthChart(chart: InsertBirthChart): Promise<BirthChart> {
    const [birthChart] = await db.insert(birthCharts).values(chart).returning();
    return birthChart;
  }
  
  async getBirthChartsByUserId(userId: number): Promise<BirthChart[]> {
    return await db.select()
      .from(birthCharts)
      .where(eq(birthCharts.userId, userId))
      .orderBy(desc(birthCharts.createdAt));
  }
  
  async getBirthChartById(id: number): Promise<BirthChart | undefined> {
    const [chart] = await db.select().from(birthCharts).where(eq(birthCharts.id, id));
    return chart;
  }
  
  // Appointment methods
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }
  
  async getAppointmentsByUserId(userId: number): Promise<Appointment[]> {
    return await db.select()
      .from(appointments)
      .where(eq(appointments.userId, userId))
      .orderBy(appointments.appointmentDate);
  }
  
  async getAppointmentById(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }
  
  async updateAppointmentStatus(id: number, confirmed: boolean, completed: boolean): Promise<Appointment | undefined> {
    const [updatedAppointment] = await db.update(appointments)
      .set({ confirmed, completed })
      .where(eq(appointments.id, id))
      .returning();
    return updatedAppointment;
  }
}

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();

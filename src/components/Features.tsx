import { Truck, ShieldCheck, Wallet } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Truck className="h-10 w-10 text-primary" />,
      title: "Free Shipping",
      desc: "Free shipping for orders over ₹2600"
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-primary" />,
      title: "Flexible Payment",
      desc: "Easy and smooth payment system"
    },
    {
      icon: <Wallet className="h-10 w-10 text-primary" />,
      title: "Earn Point",
      desc: "Every move earn reward points"
    }
  ];

  return (
    <div className="py-20 bg-background">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-12">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-6 p-8 rounded-3xl bg-white border border-secondary/5 shadow-sm hover:shadow-xl hover:shadow-secondary/5 transition-all duration-500">
            <div className="flex-shrink-0 bg-background p-4 rounded-2xl shadow-sm">
                {f.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-secondary uppercase tracking-tighter mb-1 font-heading">{f.title}</h3>
              <p className="text-sm font-medium text-muted">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;

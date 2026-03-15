import { Truck, ShieldCheck, Wallet } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Truck className="h-10 w-10 text-blue-500" />,
      title: "Free Shipping",
      desc: "Free shipping for orders over ₹2600"
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-blue-500" />,
      title: "Flexible Payment",
      desc: "Easy and smooth payment system"
    },
    {
      icon: <Wallet className="h-10 w-10 text-blue-500" />,
      title: "Earn Point",
      desc: "Every move earn reward points"
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-12">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100/50 hover:shadow-xl hover:shadow-slate-200 transition-all duration-500">
            <div className="flex-shrink-0 bg-white p-4 rounded-2xl shadow-sm">
                {f.icon}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-1">{f.title}</h3>
              <p className="text-sm font-medium text-slate-500">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;

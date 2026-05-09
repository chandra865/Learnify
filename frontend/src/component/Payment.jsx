import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { 
  ShieldCheck, 
  CreditCard, 
  Trash2, 
  ArrowLeft, 
  Lock, 
  Zap, 
  CheckCircle,
  Terminal,
  Info
} from "lucide-react";
import { toast } from "react-toastify";
import { courseBaseUrl, transactionBaseUrl } from "../utils/endpoints";
import StarRating from "./StarRating";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Badge from "./ui/Badge";

const Payment = () => {
  const { userId, courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${courseBaseUrl}/${courseId}`, { withCredentials: true });
        setCourse(response.data.data);
      } catch (error) {
        toast.error("Error fetching node manifest");
      }
    };
    fetchCourse();
  }, [courseId]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const amount = course.price === course.finalPrice ? course.price : course.finalPrice;
      const orderResponse = await axios.post(`${transactionBaseUrl}/order`, {
        amount,
        type: "single",
        courseId: courseId,
      }, { withCredentials: true });

      const data = orderResponse.data.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Learnify Protocol",
        description: "Node Subscription Synchronization",
        order_id: data.id,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
          await axios.post(`${transactionBaseUrl}/payment`, {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            userId,
            courseId,
            type: "single",
            amount,
            discountCode: null,
            paymentMethod: "Razorpay",
          }, { withCredentials: true });

          toast.success("Transaction verified. Course access protocol enabled.");
          navigate(`/course/enroll/${courseId}`);
        },
        prefill: { name: "Operator", email: "operator@learnify.io" },
        theme: { color: "#2563eb" },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error("Transactional protocol error. Request aborted.");
    } finally {
      setLoading(false);
    }
  };

  if (!course) return null;

  const finalAmount = course.price === course.finalPrice ? course.price : course.finalPrice;

  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Transactional Architecture */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-2 -ml-2">
                    <ArrowLeft size={18} />
                 </Button>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Transactional Protocol</p>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
                 Checkout <br />
                 <span className="text-slate-400">Synchronization</span>
              </h2>
            </div>

            <Card className="p-8 border-slate-200 bg-white group hover:shadow-xl transition-all">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                 <div className="w-full md:w-48 h-28 rounded-2xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
                    <img src={course.thumbnail.url} alt="Manifest Visual" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" />
                 </div>
                 <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                       <h3 className="text-2xl font-black text-slate-900 tracking-tight">{course.title}</h3>
                       <p className="text-sm font-bold text-slate-400">Lead Architect: {course.instructor?.name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <StarRating rating={course.averageRating || 0} />
                       <div className="h-4 w-[1px] bg-slate-200" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node v4.0 Active</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-xl font-black text-slate-900 tracking-tighter italic">₹{finalAmount}</p>
                    {course.price > course.finalPrice && (
                       <p className="text-xs font-bold text-slate-400 line-through">₹{course.price}</p>
                    )}
                 </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="flex items-start gap-4 p-6 bg-slate-900 rounded-[32px] text-white">
                  <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/20">
                     <ShieldCheck size={24} />
                  </div>
                  <div className="space-y-1">
                     <h4 className="text-sm font-black uppercase tracking-widest">Secure Handshake</h4>
                     <p className="text-[11px] text-slate-400 leading-relaxed">256-bit SSL encrypted transactional protocol ensuring node data integrity.</p>
                  </div>
               </div>
               <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-[32px] border border-slate-200">
                  <div className="p-3 bg-white text-slate-400 rounded-2xl border border-slate-200 flex items-center justify-center">
                     <Lock size={24} />
                  </div>
                  <div className="space-y-1">
                     <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Access Persistence</h4>
                     <p className="text-[11px] text-slate-400 leading-relaxed">Permanent node deployment following successful transactional verification.</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Operational Dispatch */}
          <aside className="w-full lg:w-80 shrink-0">
             <Card className="p-8 border-slate-200 bg-white sticky top-32 space-y-8">
                <div className="space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Protocol Dispatch</p>
                   <div className="flex items-baseline justify-between">
                      <span className="text-sm font-bold text-slate-500">Gross Total</span>
                      <span className="text-lg font-black text-slate-900 tracking-tighter italic">₹{finalAmount}</span>
                   </div>
                   <div className="flex items-baseline justify-between border-t border-slate-100 pt-4">
                      <span className="text-lg font-black text-slate-900 tracking-tight">Final Dispatch</span>
                      <span className="text-2xl font-black text-blue-600 tracking-tighter italic">₹{finalAmount}</span>
                   </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-dashed border-slate-200">
                   <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                      <CheckCircle size={16} className="text-blue-600" />
                      Manifest verification active
                   </div>
                   <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                      <Zap size={16} className="text-blue-600" />
                      Instant propagation enabled
                   </div>
                </div>

                <Button 
                   onClick={handlePayment} 
                   disabled={loading} 
                   className="w-full h-14 text-lg shadow-2xl shadow-blue-200"
                >
                   {loading ? (
                     <div className="flex items-center gap-2">
                       <Terminal size={18} className="animate-pulse" />
                       Authorizing...
                     </div>
                   ) : (
                     <div className="flex items-center gap-2">
                       <CreditCard size={20} />
                       Commit Protocol
                     </div>
                   )}
                </Button>

                <p className="text-[10px] text-center font-black uppercase tracking-widest text-slate-400"> Verified by Razorpay Network </p>
             </Card>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Payment;

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  Terminal, 
  ShoppingBag,
  CreditCard,
  X,
  Layers,
  Zap,
  Info
} from "lucide-react";
import { toast } from "react-toastify";
import StarRating from "./StarRating";
import { cartBaseUrl, transactionBaseUrl } from "../utils/endpoints";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Badge from "./ui/Badge";

const Cart = () => {
  const userId = useSelector((state) => state.user.userData?._id);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${cartBaseUrl}/${userId}`, { withCredentials: true });
      setCart(response.data.data);
      setLoading(true);
    } catch (error) {
      toast.error("Cart synchronization failure");
    }
  };

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId]);

  const handleRemoveFromCart = async (courseId) => {
    try {
      const response = await axios.patch(`${cartBaseUrl}/${userId}/${courseId}`, { withCredentials: true });
      setCart(response.data.data);
      toast.success("Protocol removed from dispatch");
    } catch (error) {
      toast.error("Removal failure");
    }
  };

  const handleCartPayment = async () => {
    if (!userId || !cart || cart.courses.length === 0) return;
    setIsProcessing(true);
    try {
      const orderResponse = await axios.post(`${transactionBaseUrl}/order`, {
        amount: cart.totalAmount,
        type: "cart",
        courseId: null,
      }, { withCredentials: true });

      const data = orderResponse.data.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Learnify Protocol",
        description: "Cart Synchronization Dispatch",
        order_id: data.id,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
          await axios.post(`${transactionBaseUrl}/payment`, {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            userId,
            type: "cart",
            amount: cart.totalAmount,
            paymentMethod: "Razorpay",
          }, { withCredentials: true });

          toast.success("Dispatch successful. Enrolled in all protocols.");
          window.location.href = "/dashboard/enrolled";
        },
        prefill: { name: "Operator", email: "operator@learnify.io" },
        theme: { color: "#2563eb" },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error("Transactional protocol error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!loading) return null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Protocol Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 border border-blue-500/20">
                 <ShoppingCart size={16} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Transactional Pipeline</p>
           </div>
           <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
              Your <br />
              <span className="text-slate-400">Dispatch Cart</span>
           </h2>
        </div>
        <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 px-4 py-2">
           {cart?.courses?.length || 0} Protocols Pending
        </Badge>
      </div>

      {!cart || cart.courses.length === 0 ? (
        <Card className="py-24 text-center space-y-6 border-dashed border-slate-200 bg-slate-50/50">
           <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center text-slate-300 shadow-sm">
              <ShoppingBag size={32} />
           </div>
           <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Dispatch Empty</h3>
              <p className="text-sm font-medium text-slate-400 max-w-xs mx-auto">
                No knowledge protocols found in current pipeline. Explore discovery terminal to add nodes.
              </p>
           </div>
           <Button variant="outline" size="sm" onClick={() => window.location.href = "/courses"}>Discovery Hub</Button>
        </Card>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Node Matrix */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
               <span>Manifest Items</span>
               <span>Value sync</span>
            </div>
            {cart.courses.map((course) => (
              <Card key={course._id} className="p-6 overflow-hidden hover:border-blue-300 transition-all group">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                   <div className="w-full md:w-32 h-20 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                      <img src={course?.thumbnail?.url} alt={course.title} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" />
                   </div>
                   <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight uppercase group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-4">
                         <StarRating rating={course.averageRating || 0} />
                         <Badge variant="outline" className="text-[8px] px-2 py-0.5 border-slate-100 text-slate-400">Node v4.0</Badge>
                      </div>
                   </div>
                   <div className="flex items-center gap-6 self-center">
                      <div className="text-right">
                         <p className={`text-lg font-black text-slate-900 tracking-tighter italic ${course.finalPrice < course.price ? "line-through text-slate-300 text-sm" : ""}`}>
                           ₹{course.price}
                         </p>
                         {course.finalPrice < course.price && (
                           <p className="text-lg font-black text-blue-600 tracking-tighter italic">₹{course.finalPrice}</p>
                         )}
                      </div>
                      <button 
                        onClick={() => handleRemoveFromCart(course._id)}
                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                         <Trash2 size={18} />
                      </button>
                   </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Operational Dispatch Sidebar */}
          <aside className="w-full lg:w-80 shrink-0">
             <Card className="p-8 border-slate-200 bg-white sticky top-32 space-y-8 shadow-xl shadow-blue-900/5">
                <div className="space-y-4">
                   <div className="flex items-center gap-2 mb-2">
                      <Terminal size={14} className="text-blue-600" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Dispatch Summary</p>
                   </div>
                   <div className="flex items-baseline justify-between">
                      <span className="text-sm font-bold text-slate-500">Gross Dispatch</span>
                      <span className="text-lg font-black text-slate-900 tracking-tighter italic">₹{cart.totalAmount}</span>
                   </div>
                   <div className="flex items-baseline justify-between border-t border-slate-100 pt-4">
                      <span className="text-lg font-black text-slate-900 tracking-tight">Total Yield</span>
                      <span className="text-2xl font-black text-blue-600 tracking-tighter italic">₹{cart.totalAmount}</span>
                   </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-dashed border-slate-200">
                   <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                      <ShieldCheck size={16} className="text-blue-600" />
                      Protocol stability verified
                   </div>
                   <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                      <Zap size={16} className="text-blue-600" />
                      Instant node propagation
                   </div>
                </div>

                <Button 
                   onClick={handleCartPayment} 
                   disabled={isProcessing} 
                   className="w-full h-14 text-lg shadow-2xl shadow-blue-200"
                >
                   {isProcessing ? (
                     <div className="flex items-center gap-2">
                       <Terminal size={18} className="animate-pulse" />
                       Authorizing...
                     </div>
                   ) : (
                     <div className="flex items-center gap-2">
                       <CreditCard size={20} />
                       Commit Dispatch
                     </div>
                   )}
                </Button>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                   <Info size={14} className="shrink-0" />
                   Handshake complete. Dispatching to enrolled registry.
                </div>
             </Card>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;

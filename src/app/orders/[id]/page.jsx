import { getOrderById } from "@/lib/orders"; // your backend fetching function
import OrderActions from "@/components/OrderActions";

export default async function OrderDetailPage({ params }) {
  const { id } = params;
  const order = await getOrderById(id);

  if (!order) return <p className="text-center mt-10">Order not found.</p>;

  return (
    <div className="w-11/12 mx-auto py-10 grid md:grid-cols-3 gap-8">
      {/* LEFT: Order info */}
      <div className="md:col-span-2 space-y-6">
        <div className="p-6 border rounded-lg shadow-md bg-white">
          <h2 className="text-lg font-bold mb-2">Order Details</h2>
          <p>
            <span className="font-semibold">Order ID:</span> {order._id}
          </p>
          <p>
            <span className="font-semibold">Customer:</span> {order.customerName}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {order.customerEmail}
          </p>
          <p>
            <span className="font-semibold">Phone:</span> {order.customerPhone}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {order.customerAddress}
          </p>
          <p>
            <span className="font-semibold">Total:</span> ${order.total}
          </p>
        </div>
      </div>

      {/* RIGHT: Payment Actions */}
      <div className="p-6 border rounded-lg shadow-md bg-white h-fit">
        <h2 className="font-bold mb-4">Payment</h2>
        <OrderActions order={order} />
      </div>
    </div>
  );
}

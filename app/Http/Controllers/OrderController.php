<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Menu;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display menu & categories for self-ordering.
     */
    public function index(Request $request)
    {
        $tableNumber = $request->query('table', '14');
        $categories = Category::with('menus')->get();
        $allMenus = Menu::with('category')->get();

        return view('order.index', compact('tableNumber', 'categories', 'allMenus'));
    }

    /**
     * Store new customer order using DB Transaction.
     */
    public function store(Request $request)
    {
        $request->validate([
            'table_number' => 'required|string',
            'customer_name' => 'required|string|max:100',
            'payment_method' => 'required|in:qris,kasir',
            'items' => 'required|array|min:1',
            'items.*.menu_id' => 'required|exists:menus,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.spiciness_level' => 'nullable|string',
            'items.*.notes' => 'nullable|string',
        ]);

        $order = DB::transaction(function () use ($request) {
            $rawSubtotal = 0;
            $itemsToCreate = [];

            foreach ($request->items as $itemData) {
                $menu = Menu::findOrFail($itemData['menu_id']);
                $qty = (int) $itemData['quantity'];
                $unitPrice = (float) $menu->price;
                $itemSubtotal = $unitPrice * $qty;
                $rawSubtotal += $itemSubtotal;

                $itemsToCreate[] = [
                    'menu_id' => $menu->id,
                    'spiciness_level' => $itemData['spiciness_level'] ?? null,
                    'notes' => $itemData['notes'] ?? null,
                    'quantity' => $qty,
                    'unit_price' => $unitPrice,
                    'subtotal' => $itemSubtotal,
                ];
            }

            // Calculate 10% PB1 Tax
            $taxAmount = round($rawSubtotal * 0.10, 2);
            $totalPrice = $rawSubtotal + $taxAmount;

            $newOrder = Order::create([
                'table_number' => $request->table_number,
                'customer_name' => $request->customer_name,
                'total_price' => $totalPrice,
                'tax_amount' => $taxAmount,
                'payment_method' => $request->payment_method,
                'status' => 'pending',
            ]);

            foreach ($itemsToCreate as $item) {
                $item['order_id'] = $newOrder->id;
                OrderItem::create($item);
            }

            return $newOrder;
        });

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'order_id' => $order->id,
                'redirect_url' => route('order.success', $order->id),
            ]);
        }

        return redirect()->route('order.success', $order->id);
    }

    /**
     * Display order success confirmation summary.
     */
    public function success($id)
    {
        $order = Order::with('items.menu')->findOrFail($id);

        return view('order.success', compact('order'));
    }
}

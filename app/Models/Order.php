<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'table_number',
        'customer_name',
        'total_price',
        'tax_amount',
        'payment_method',
        'status',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
        'tax_amount' => 'decimal:2',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}

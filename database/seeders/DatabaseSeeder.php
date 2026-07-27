<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Menu;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $catMie = Category::create([
            'name' => 'Mie Pedas',
            'slug' => 'mie-pedas',
        ]);

        $catDimsum = Category::create([
            'name' => 'Dimsum',
            'slug' => 'dimsum',
        ]);

        $catEs = Category::create([
            'name' => 'Es & Minuman',
            'slug' => 'es-minuman',
        ]);

        // MIE PEDAS
        Menu::create([
            'category_id' => $catMie->id,
            'name' => 'Mie Hompimpa',
            'description' => 'Mie asin gurih khas Gacoan dengan pangsit goreng renyah & taburan ayam lembut.',
            'price' => 10500,
            'image' => '/images/mie_hompimpa.png',
            'has_spicy_levels' => true,
        ]);

        Menu::create([
            'category_id' => $catMie->id,
            'name' => 'Mie Iblis',
            'description' => 'Mie manis pedas gurih dengan taburan cabai asli, pangsit renyah & daging ayam.',
            'price' => 10500,
            'image' => '/images/mie_iblis.png',
            'has_spicy_levels' => true,
        ]);

        Menu::create([
            'category_id' => $catMie->id,
            'name' => 'Mie Gacoan',
            'description' => 'Signature mie manis pedas khas Gacoan dengan topping ayam cincang & pangsit goreng.',
            'price' => 10500,
            'image' => '/images/mie_gacoan.png',
            'has_spicy_levels' => true,
        ]);

        Menu::create([
            'category_id' => $catMie->id,
            'name' => 'Mie Suit',
            'description' => 'Mie asin gurih tanpa cabai (non-pedas), cocok untuk yang suka rasa asli gurih.',
            'price' => 10500,
            'image' => '/images/mie_hompimpa.png',
            'has_spicy_levels' => false,
        ]);

        Menu::create([
            'category_id' => $catMie->id,
            'name' => 'Mie Angel',
            'description' => 'Mie original gurih lezat bertabur ayam cincang tanpa minyak pedas.',
            'price' => 9500,
            'image' => '/images/mie_hompimpa.png',
            'has_spicy_levels' => false,
        ]);

        // DIMSUM
        Menu::create([
            'category_id' => $catDimsum->id,
            'name' => 'Udang Keju',
            'description' => 'Dimsum goreng balut tepung renyah isi udang gurih & lelehan keju mozarella.',
            'price' => 9500,
            'image' => '/images/udang_keju.png',
            'has_spicy_levels' => false,
        ]);

        Menu::create([
            'category_id' => $catDimsum->id,
            'name' => 'Siomay Ayam',
            'description' => 'Siomay kukus lembut olahan dging ayam pilihan disajikan hangat.',
            'price' => 9500,
            'image' => '/images/siomay_ayam.png',
            'has_spicy_levels' => false,
        ]);

        Menu::create([
            'category_id' => $catDimsum->id,
            'name' => 'Pangsit Goreng',
            'description' => 'Pangsit goreng garing renyah khas Gacoan isi olahan daging ayam gurih.',
            'price' => 9500,
            'image' => 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=300',
            'has_spicy_levels' => false,
        ]);

        Menu::create([
            'category_id' => $catDimsum->id,
            'name' => 'Lumpia Udang',
            'description' => 'Lumpia kulit renyah isi udang lembut dan bumbu rempah spesial.',
            'price' => 9500,
            'image' => 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300',
            'has_spicy_levels' => false,
        ]);

        // ES & MINUMAN
        Menu::create([
            'category_id' => $catEs->id,
            'name' => 'Es Gobak Sodor',
            'description' => 'Es buah segar legendaris perpaduan jelly tropis, buah manis, sirup & susu gurih.',
            'price' => 8500,
            'image' => '/images/es_gobak_sodor.png',
            'has_spicy_levels' => false,
        ]);

        Menu::create([
            'category_id' => $catEs->id,
            'name' => 'Es Teklek',
            'description' => 'Es ramuan buah naga & susu manis segar pencuci mulut dingin.',
            'price' => 8500,
            'image' => 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300',
            'has_spicy_levels' => false,
        ]);

        Menu::create([
            'category_id' => $catEs->id,
            'name' => 'Es Sluku Bathok',
            'description' => 'Es mocca susu kekinian dengan topping jelly kelapa kenyal.',
            'price' => 8500,
            'image' => 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=300',
            'has_spicy_levels' => false,
        ]);

        Menu::create([
            'category_id' => $catEs->id,
            'name' => 'Es Teh Manis Jumbo',
            'description' => 'Es teh manis aroma melati segar porsi jumbo pelepas dahaga.',
            'price' => 4500,
            'image' => 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300',
            'has_spicy_levels' => false,
        ]);

        Menu::create([
            'category_id' => $catEs->id,
            'name' => 'Lemon Tea Segar',
            'description' => 'Es teh dengan perasan jeruk lemon asli yang menyegarkan.',
            'price' => 6000,
            'image' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300',
            'has_spicy_levels' => false,
        ]);

        Menu::create([
            'category_id' => $catEs->id,
            'name' => 'Air Mineral Cold',
            'description' => 'Air mineral kemasan dingin 600ml.',
            'price' => 4000,
            'image' => 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=300',
            'has_spicy_levels' => false,
        ]);
    }
}

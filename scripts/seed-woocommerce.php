<?php
// Seed WooCommerce products for eTotalSports
if ( ! class_exists( 'WooCommerce' ) ) {
    echo "WooCommerce is not active.\n";
    exit;
}

$cats = [
    'running'     => 'Running',
    'training'    => 'Training',
    'team-sports' => 'Team Sports',
    'footwear'    => 'Footwear',
    'accessories' => 'Accessories',
];

$cat_ids = [];
foreach ( $cats as $slug => $name ) {
    $term = get_term_by( 'slug', $slug, 'product_cat' );
    if ( ! $term ) {
        $result = wp_insert_term( $name, 'product_cat', [ 'slug' => $slug ] );
        if ( ! is_wp_error( $result ) ) {
            $cat_ids[$slug] = $result['term_id'];
        }
    } else {
        $cat_ids[$slug] = $term->term_id;
    }
}

$products = [
    [
        'name'          => 'Velocity Pro Runner',
        'slug'          => 'velocity-pro-runner',
        'sku'           => 'ETS-RUN-101',
        'regular_price' => '160',
        'sale_price'    => '129',
        'cats'          => ['running', 'footwear'],
        'short_desc'    => 'Carbon-infused road running shoe designed for high-mileage velocity and breathability.',
    ],
    [
        'name'          => 'Apex Gym Trainer',
        'slug'          => 'apex-gym-trainer',
        'sku'           => 'ETS-TRN-102',
        'regular_price' => '140',
        'sale_price'    => '',
        'cats'          => ['training', 'footwear'],
        'short_desc'    => 'Multi-directional gym trainer with zero-drop heel stability for heavy lifts and agility.',
    ],
    [
        'name'          => 'Court Flight Basketball Shoe',
        'slug'          => 'court-flight',
        'sku'           => 'ETS-FTW-103',
        'regular_price' => '175',
        'sale_price'    => '149',
        'cats'          => ['team-sports', 'footwear'],
        'short_desc'    => 'High-top responsiveness with explosive court grip and lateral ankle support.',
    ],
    [
        'name'          => 'Stride Aero Tee',
        'slug'          => 'stride-aero-tee',
        'sku'           => 'ETS-RUN-104',
        'regular_price' => '45',
        'sale_price'    => '34',
        'cats'          => ['running'],
        'short_desc'    => 'Ultra-lightweight micro-mesh tee with laser-cut breathability and anti-odor tech.',
    ],
    [
        'name'          => 'Pitch Master Match Football',
        'slug'          => 'pitch-master-football',
        'sku'           => 'ETS-TEAM-105',
        'regular_price' => '38',
        'sale_price'    => '',
        'cats'          => ['team-sports'],
        'short_desc'    => 'FIFA-spec match football with thermally bonded panels for aerodynamically true flight.',
    ],
    [
        'name'          => 'Court Elite Indoor/Outdoor Basketball',
        'slug'          => 'court-elite-basketball',
        'sku'           => 'ETS-TEAM-106',
        'regular_price' => '55',
        'sale_price'    => '44',
        'cats'          => ['team-sports'],
        'short_desc'    => 'Composite leather basketball with deep pebbled channels for superior ball control.',
    ],
    [
        'name'          => 'Rally Carbon Tennis Racket',
        'slug'          => 'rally-carbon-racket',
        'sku'           => 'ETS-TEAM-107',
        'regular_price' => '220',
        'sale_price'    => '179',
        'cats'          => ['team-sports'],
        'short_desc'    => 'High-modulus carbon graphite frame offering explosive power with pinpoint control.',
    ],
    [
        'name'          => 'Iron Grip Dumbbell Set',
        'slug'          => 'iron-grip-dumbbell-set',
        'sku'           => 'ETS-TRN-108',
        'regular_price' => '120',
        'sale_price'    => '96',
        'cats'          => ['training'],
        'short_desc'    => 'Heavy-duty knurled steel hex dumbbell set designed for home and commercial strength training.',
    ],
    [
        'name'          => 'HydroCharge Bottle 750ml',
        'slug'          => 'hydrocharge-bottle',
        'sku'           => 'ETS-ACC-109',
        'regular_price' => '24',
        'sale_price'    => '',
        'cats'          => ['accessories'],
        'short_desc'    => 'Vacuum-insulated stainless steel water bottle keeping drinks ice-cold for 24 hours.',
    ],
    [
        'name'          => 'Stadium Training Shorts',
        'slug'          => 'stadium-training-shorts',
        'sku'           => 'ETS-TRN-110',
        'regular_price' => '52',
        'sale_price'    => '39',
        'cats'          => ['training'],
        'short_desc'    => '4-way stretch gym shorts with zipped security pockets and sweat-wicking liner.',
    ],
    [
        'name'          => 'Phantom Willow Cricket Bat',
        'slug'          => 'phantom-cricket-bat',
        'sku'           => 'ETS-TEAM-111',
        'regular_price' => '150',
        'sale_price'    => '119',
        'cats'          => ['team-sports'],
        'short_desc'    => 'Grade 1 English willow cricket bat with thick edges and light balanced pickup.',
    ],
    [
        'name'          => 'Velocity Run Pack 12L',
        'slug'          => 'velocity-run-pack',
        'sku'           => 'ETS-ACC-112',
        'regular_price' => '68',
        'sale_price'    => '55',
        'cats'          => ['accessories', 'running'],
        'short_desc'    => 'Ergonomic 12L hydration pack with chest harness for trail runners and endurance athletes.',
    ],
];

foreach ( $products as $p ) {
    $existing = wc_get_product_id_by_sku( $p['sku'] );
    if ( $existing ) {
        echo "Product {$p['name']} already exists (ID: $existing)\n";
        continue;
    }

    $product = new WC_Product_Simple();
    $product->set_name( $p['name'] );
    $product->set_slug( $p['slug'] );
    $product->set_sku( $p['sku'] );
    $product->set_regular_price( $p['regular_price'] );
    if ( ! empty( $p['sale_price'] ) ) {
        $product->set_sale_price( $p['sale_price'] );
        $product->set_price( $p['sale_price'] );
    } else {
        $product->set_price( $p['regular_price'] );
    }
    $product->set_short_description( $p['short_desc'] );
    $product->set_status( 'publish' );
    $product->set_manage_stock( false );
    $product->set_stock_status( 'instock' );

    $assigned_cats = [];
    foreach ( $p['cats'] as $c_slug ) {
        if ( isset( $cat_ids[$c_slug] ) ) {
            $assigned_cats[] = $cat_ids[$c_slug];
        }
    }
    if ( ! empty( $assigned_cats ) ) {
        $product->set_category_ids( $assigned_cats );
    }

    $id = $product->save();
    echo "Created product {$p['name']} (ID: $id)\n";
}

echo "WooCommerce seed completed successfully.\n";

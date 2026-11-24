<?php
/**
 * Plugin Name: eTotalSports Headless Integration & CORS
 * Description: Enables CORS headers for WooCommerce Store API and links admin/login back to the live customer storefront.
 * Version: 1.0.0
 */

// 1. CORS Headers for REST API & Store API
add_action( 'init', function() {
    $origin = get_http_origin();
    $allowed_origins = [
        'https://etotalsports.com',
        'http://localhost:3000',
        'http://localhost:4173',
        'http://localhost:5173',
    ];

    $is_allowed = false;
    if ( $origin ) {
        $host = parse_url( $origin, PHP_URL_HOST );
        if ( in_array( $origin, $allowed_origins, true ) || ( $host && preg_match( '/\.vercel\.app$/i', $host ) ) ) {
            $is_allowed = true;
        }
    }

    if ( $is_allowed && $origin ) {
        header( "Access-Control-Allow-Origin: " . $origin );
        header( "Access-Control-Allow-Credentials: true" );
    } else {
        header( "Access-Control-Allow-Origin: *" );
    }

    header( "Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS" );
    header( "Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, Cart-Token, Nonce, X-Requested-With" );
    header( "Access-Control-Expose-Headers: Cart-Token, Nonce" );

    // Handle OPTIONS Preflight
    if ( isset( $_SERVER['REQUEST_METHOD'] ) && 'OPTIONS' === $_SERVER['REQUEST_METHOD'] ) {
        status_header( 200 );
        exit;
    }
});

// Also hook into rest_pre_serve_request for maximum compatibility with WP REST API
add_filter( 'rest_pre_serve_request', function( $value ) {
    $origin = get_http_origin();
    $host = $origin ? parse_url( $origin, PHP_URL_HOST ) : '';
    if ( $origin && ( in_array( $origin, ['https://etotalsports.com', 'http://localhost:3000', 'http://localhost:4173'], true ) || preg_match( '/\.vercel\.app$/i', $host ) ) ) {
        header( "Access-Control-Allow-Origin: " . $origin );
        header( "Access-Control-Allow-Credentials: true" );
    } else {
        header( "Access-Control-Allow-Origin: *" );
    }
    header( "Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS" );
    header( "Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, Cart-Token, Nonce, X-Requested-With" );
    header( "Access-Control-Expose-Headers: Cart-Token, Nonce" );
    return $value;
});

// 2. Login URL and Text
add_filter( 'login_headerurl', function() {
    return 'https://etotalsports.com';
});

add_filter( 'login_headertext', function() {
    return 'Return to eTotalSports Storefront';
});

// 3. Admin Bar "View Site" Link Points to Storefront
add_action( 'admin_bar_menu', function( $wp_admin_bar ) {
    $site_name = $wp_admin_bar->get_node( 'site-name' );
    if ( $site_name ) {
        $site_name->href = 'https://etotalsports.com';
        $wp_admin_bar->add_node( $site_name );
    }
    $view_site = $wp_admin_bar->get_node( 'view-site' );
    if ( $view_site ) {
        $view_site->href = 'https://etotalsports.com';
        $wp_admin_bar->add_node( $view_site );
    }
}, 999 );

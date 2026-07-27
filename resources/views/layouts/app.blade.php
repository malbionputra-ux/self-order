<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Mie Gacoan - Self Ordering</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Bootstrap 5 CSS & Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    
    <style>
        :root {
            --gacoan-magenta: #E60067;
            --gacoan-magenta-dark: #C00054;
            --gacoan-magenta-light: #FFF0F5;
            --gacoan-dark: #1A1A1A;
            --gacoan-gray: #757575;
            --gacoan-bg: #F8F9FA;
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #EAEAEA;
            color: var(--gacoan-dark);
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            min-height: 100vh;
        }

        .mobile-container {
            width: 100%;
            max-width: 480px;
            background-color: #FFFFFF;
            min-height: 100vh;
            position: relative;
            box-shadow: 0 0 25px rgba(0, 0, 0, 0.15);
            display: flex;
            flex-direction: column;
            padding-bottom: 90px;
        }

        .btn-gacoan {
            background-color: var(--gacoan-magenta);
            color: #FFFFFF;
            font-weight: 700;
            border-radius: 12px;
            border: none;
            transition: all 0.2s ease-in-out;
        }

        .btn-gacoan:hover, .btn-gacoan:active, .btn-gacoan:focus {
            background-color: var(--gacoan-magenta-dark);
            color: #FFFFFF;
        }

        .btn-outline-gacoan {
            border: 2px solid var(--gacoan-magenta);
            color: var(--gacoan-magenta);
            font-weight: 700;
            border-radius: 12px;
            background: transparent;
        }

        .btn-outline-gacoan:hover, .btn-outline-gacoan.active {
            background-color: var(--gacoan-magenta);
            color: #FFFFFF;
        }

        .badge-gacoan {
            background-color: var(--gacoan-magenta);
            color: white;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 4px;
            height: 4px;
        }
        ::-webkit-scrollbar-thumb {
            background: #D1D5DB;
            border-radius: 10px;
        }
    </style>
    @yield('styles')
</head>
<body>
    <div class="mobile-container">
        @yield('content')
    </div>

    <!-- Bootstrap 5 JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    @yield('scripts')
</body>
</html>

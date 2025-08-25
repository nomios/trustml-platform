/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		backgroundImage: {
  			'gradient-primary': 'linear-gradient(to right, rgb(79 70 229), rgb(59 130 246))',
  			'gradient-secondary': 'linear-gradient(to right, rgb(34 211 238), rgb(79 70 229))',
  			'gradient-dark': 'linear-gradient(to bottom right, rgb(15 23 42), rgb(30 41 59))',
  			'gradient-card-indigo': 'linear-gradient(to bottom right, rgba(49, 46, 129, 0.5), rgba(67, 56, 202, 0.5))',
  			'gradient-card-cyan': 'linear-gradient(to bottom right, rgba(22, 78, 99, 0.5), rgba(21, 94, 117, 0.5))',
  			'gradient-card-blue': 'linear-gradient(to bottom right, rgba(30, 58, 138, 0.5), rgba(29, 78, 216, 0.5))',
  			'gradient-card-purple': 'linear-gradient(to bottom right, rgba(88, 28, 135, 0.5), rgba(107, 33, 168, 0.5))'
  		},
  		backdropBlur: {
  			xs: '2px'
  		},
  		boxShadow: {
  			'glow-indigo': '0 0 20px rgba(79, 70, 229, 0.3)',
  			'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.3)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			},
  			'fade-in': {
  				'0%': { opacity: '0', transform: 'translateY(10px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			},
  			'slide-up': {
  				'0%': { transform: 'translateY(100%)' },
  				'100%': { transform: 'translateY(0)' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-in': 'fade-in 0.5s ease-out',
  			'slide-up': 'slide-up 0.3s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
  // Optimize build by purging unused styles
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './src/**/*.{js,jsx,ts,tsx}',
      './public/index.html'
    ],
    // Safelist commonly used dark theme classes
    safelist: [
      'bg-slate-900',
      'bg-slate-800',
      'text-white',
      'text-slate-300',
      'text-slate-400',
      'border-slate-700',
      'bg-indigo-600',
      'bg-cyan-500',
      'hover:bg-indigo-500',
      'hover:text-cyan-400'
    ]
  }
};
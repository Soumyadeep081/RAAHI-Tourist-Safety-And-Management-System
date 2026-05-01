$pages = @{
    "help.html" = @{
        title = "Help Center"
        desc = "Find answers to common questions and get support."
        img = "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&q=80&w=1200"
        content = @"
                <div class="card" style="padding: 40px; border: none; box-shadow: 0 10px 40px rgba(0,0,0,0.05);">
                    <h2 class="text-title-lg mb-md">Contact Us</h2>
                    <div style="background: #F8FAFC; padding: 24px; border-radius: 16px; display: grid; gap: 16px; margin-bottom: 40px;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            <span class="text-body-md"><strong>Email:</strong> supportatraahi@gmail.com</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            <span class="text-body-md"><strong>Phone:</strong> 6207699168</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            <span class="text-body-md"><strong>Location:</strong> Alpha 2, Greater Noida, Uttar Pradesh</span>
                        </div>
                    </div>

                    <h2 class="text-title-lg mb-md">Frequently Asked Questions</h2>
                    <div style="display: flex; flex-direction: column; gap: 24px;">
                        <div>
                            <h3 class="text-title-md mb-xs">How does the SOS feature work?</h3>
                            <p class="text-body-md" style="color: var(--color-muted);">Pressing the SOS button instantly sends your precise GPS coordinates to your registered emergency contacts and local authorities.</p>
                        </div>
                        <div>
                            <h3 class="text-title-md mb-xs">Does tracking work offline?</h3>
                            <p class="text-body-md" style="color: var(--color-muted);">Yes, Raahi caches your location data locally when you lose signal and automatically syncs it once you reconnect to a network.</p>
                        </div>
                    </div>
                </div>
"@
    }
    "safety.html" = @{
        title = "Safety Information"
        desc = "Learn how Raahi keeps you safe while exploring the world."
        img = "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=1200"
        content = @"
                <div class="card" style="padding: 40px; border: none; box-shadow: 0 10px 40px rgba(0,0,0,0.05);">
                    <h2 class="text-title-lg mb-md">Our Security Protocols</h2>
                    <p class="text-body-md mb-md" style="color: var(--color-muted);">At Raahi, safety isn't just a feature—it's our foundation. We employ bank-grade encryption to ensure your location data is visible only to you and the emergency contacts you explicitly authorize.</p>
                    
                    <div class="grid-2 mt-lg" style="gap: 24px;">
                        <div style="background: #F8FAFC; padding: 24px; border-radius: 16px;">
                            <h3 class="text-title-md mb-sm">End-to-End Encryption</h3>
                            <p class="text-body-sm" style="color: var(--color-muted);">Your live tracking data is encrypted before it leaves your device.</p>
                        </div>
                        <div style="background: #F8FAFC; padding: 24px; border-radius: 16px;">
                            <h3 class="text-title-md mb-sm">24/7 Monitoring</h3>
                            <p class="text-body-sm" style="color: var(--color-muted);">Our automated threat detection systems monitor regional safety advisories constantly.</p>
                        </div>
                    </div>
                </div>
"@
    }
    "cancellation.html" = @{
        title = "Cancellation Options"
        desc = "Flexible options for changing your safety subscription."
        img = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200"
        content = @"
                <div class="card" style="padding: 40px; border: none; box-shadow: 0 10px 40px rgba(0,0,0,0.05);">
                    <h2 class="text-title-lg mb-md">Flexible Commitments</h2>
                    <p class="text-body-md mb-md" style="color: var(--color-muted);">Travel plans change, and we understand that. You can cancel your Raahi Premium subscription at any time with no hidden fees.</p>
                    
                    <ul style="list-style: none; padding: 0; margin-top: 24px;">
                        <li style="display: flex; gap: 12px; margin-bottom: 16px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            <span><strong>Monthly Plans:</strong> Cancel anytime before your next billing cycle.</span>
                        </li>
                        <li style="display: flex; gap: 12px; margin-bottom: 16px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            <span><strong>Annual Plans:</strong> Prorated refunds available within the first 30 days.</span>
                        </li>
                    </ul>
                </div>
"@
    }
    "about.html" = @{
        title = "About Us"
        desc = "Our mission is to empower global explorers with invisible protection."
        img = "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=1200"
        content = @"
                <div class="card" style="padding: 40px; border: none; box-shadow: 0 10px 40px rgba(0,0,0,0.05);">
                    <h2 class="text-title-lg mb-md">Our Story</h2>
                    <p class="text-body-md mb-lg" style="color: var(--color-muted);">Raahi was born from a simple realization: the world is beautiful, but traveling it shouldn't mean leaving your safety net behind. Founded in 2026, we set out to build a platform that acts as a silent guardian for adventurers everywhere.</p>
                    
                    <div style="background: url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800') center/cover; height: 200px; border-radius: 16px; margin-bottom: 32px;"></div>
                    
                    <h3 class="text-title-md mb-sm">Our Mission</h3>
                    <p class="text-body-md" style="color: var(--color-muted);">To democratize travel safety through accessible, reliable, and privacy-first technology.</p>
                </div>
"@
    }
    "careers.html" = @{
        title = "Careers"
        desc = "Join us in building the future of travel safety."
        img = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
        content = @"
                <div class="card" style="padding: 40px; border: none; box-shadow: 0 10px 40px rgba(0,0,0,0.05);">
                    <h2 class="text-title-lg mb-md">Work With Purpose</h2>
                    <p class="text-body-md mb-lg" style="color: var(--color-muted);">At Raahi, the code you write and the products you design directly contribute to saving lives. We are always looking for passionate engineers, designers, and growth experts.</p>
                    
                    <h3 class="text-title-md mb-sm">Open Positions</h3>
                    <div style="border: 1px solid var(--color-hairline); border-radius: 12px; padding: 20px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-weight: 600;">Senior Backend Engineer</div>
                            <div class="text-caption">Remote / India</div>
                        </div>
                        <button class="btn btn-secondary">Apply</button>
                    </div>
                    <div style="border: 1px solid var(--color-hairline); border-radius: 12px; padding: 20px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-weight: 600;">Product Designer</div>
                            <div class="text-caption">Remote / Global</div>
                        </div>
                        <button class="btn btn-secondary">Apply</button>
                    </div>
                </div>
"@
    }
    "investors.html" = @{
        title = "Investors"
        desc = "Partner with us to protect millions of travelers worldwide."
        img = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200"
        content = @"
                <div class="card" style="padding: 40px; border: none; box-shadow: 0 10px 40px rgba(0,0,0,0.05);">
                    <h2 class="text-title-lg mb-md">Growth & Impact</h2>
                    <p class="text-body-md mb-lg" style="color: var(--color-muted);">Raahi operates at the intersection of travel tech and personal security—a rapidly expanding market. We are backed by leading venture capital firms who believe in our mission.</p>
                    
                    <div class="grid-2" style="gap: 24px; margin-bottom: 32px;">
                        <div style="text-align: center; padding: 24px; background: #F8FAFC; border-radius: 16px;">
                            <div class="text-display-md" style="color: var(--color-primary);">2M+</div>
                            <div class="text-caption">Active Users</div>
                        </div>
                        <div style="text-align: center; padding: 24px; background: #F8FAFC; border-radius: 16px;">
                            <div class="text-display-md" style="color: var(--color-primary);">150+</div>
                            <div class="text-caption">Countries Supported</div>
                        </div>
                    </div>
                    <p class="text-body-sm text-center">For investor relations inquiries, please email invest@raahi.com.</p>
                </div>
"@
    }
    "tracking.html" = @{
        title = "Live Tracking"
        desc = "Share your journey securely with loved ones in real-time."
        img = "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&q=80&w=1200"
        content = @"
                <div class="card" style="padding: 40px; border: none; box-shadow: 0 10px 40px rgba(0,0,0,0.05);">
                    <h2 class="text-title-lg mb-md">Dynamic Location Sharing</h2>
                    <p class="text-body-md mb-lg" style="color: var(--color-muted);">Generate a secure, time-limited link to share your live location with family and friends. They can view your progress on a web map without needing to install the app.</p>
                    
                    <div style="background: url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800') center/cover; height: 250px; border-radius: 16px; margin-bottom: 24px; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);"></div>
                    
                    <h3 class="text-title-md mb-sm">Battery Optimized</h3>
                    <p class="text-body-md" style="color: var(--color-muted);">Our tracking algorithm dynamically adjusts update frequency based on your movement speed and battery level, ensuring we don't drain your phone when you need it most.</p>
                </div>
"@
    }
    "sos.html" = @{
        title = "SOS Emergency"
        desc = "Immediate response when you need it the most."
        img = "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1200"
        content = @"
                <div class="card" style="padding: 40px; border: none; box-shadow: 0 10px 40px rgba(0,0,0,0.05); text-align: center;">
                    <div style="width: 80px; height: 80px; background: rgba(229, 46, 77, 0.1); color: var(--color-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    <h2 class="text-title-lg mb-md">The SOS Protocol</h2>
                    <p class="text-body-md mb-lg" style="color: var(--color-muted); text-align: left;">When you trigger an SOS alert, Raahi bypasses standard network limitations to ping our servers. We instantly notify your predefined emergency contacts via SMS and Email with your exact GPS coordinates and a link to a live tracking dashboard.</p>
                    
                    <div style="background: #FFF1F2; border: 1px solid #FECDD3; padding: 20px; border-radius: 12px; text-align: left;">
                        <h4 style="color: #BE123C; margin-bottom: 8px;">Silent Mode Activation</h4>
                        <p style="color: #9F1239; font-size: 14px; margin: 0;">In situations where a loud alarm might compromise your safety, the SOS can be triggered silently by rapidly pressing the volume button 5 times.</p>
                    </div>
                </div>
"@
    }
    "terms.html" = @{
        title = "Terms of Service"
        desc = "The guidelines and rules for using the Raahi platform."
        img = "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200"
        content = @"
                <div class="card" style="padding: 40px; border: none; box-shadow: 0 10px 40px rgba(0,0,0,0.05);">
                    <h2 class="text-title-lg mb-md">Terms and Conditions</h2>
                    <p class="text-caption mb-lg">Last Updated: April 2026</p>
                    
                    <div style="color: var(--color-muted); font-size: 15px; line-height: 1.8;">
                        <h3 class="text-title-md mb-sm" style="color: var(--color-ink);">1. Acceptance of Terms</h3>
                        <p class="mb-md">By accessing and using the Raahi platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
                        
                        <h3 class="text-title-md mb-sm" style="color: var(--color-ink);">2. Service Limitations</h3>
                        <p class="mb-md">While Raahi strives to provide uninterrupted service, emergency response capabilities depend on third-party network providers, device battery life, and GPS availability. Raahi is not a replacement for local emergency services (like 911).</p>
                        
                        <h3 class="text-title-md mb-sm" style="color: var(--color-ink);">3. User Responsibilities</h3>
                        <p>You agree to provide accurate emergency contact information and ensure you have their consent to be added to your profile.</p>
                    </div>
                </div>
"@
    }
    "privacy.html" = @{
        title = "Privacy Policy"
        desc = "How we protect your data and location information."
        img = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200"
        content = @"
                <div class="card" style="padding: 40px; border: none; box-shadow: 0 10px 40px rgba(0,0,0,0.05);">
                    <h2 class="text-title-lg mb-md">Privacy First. Always.</h2>
                    <p class="text-caption mb-lg">Last Updated: April 2026</p>
                    
                    <div style="color: var(--color-muted); font-size: 15px; line-height: 1.8;">
                        <p class="mb-md">Your location data is the most sensitive information you possess. At Raahi, we treat it with the highest level of security and respect.</p>
                        
                        <ul style="padding-left: 20px;">
                            <li class="mb-sm"><strong>Zero Knowledge Architecture:</strong> We do not sell, share, or monetize your location history.</li>
                            <li class="mb-sm"><strong>Auto-Deletion:</strong> Standard tracking data is permanently deleted from our servers 24 hours after a tracking session ends.</li>
                            <li class="mb-sm"><strong>Explicit Consent:</strong> Location sharing is entirely opt-in and controlled by you.</li>
                        </ul>
                    </div>
                </div>
"@
    }
}

$template = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{0} – Raahi</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        html {{ scroll-behavior: smooth; }}
        .fade-up {{
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }}
        .fade-up.visible {{
            opacity: 1;
            transform: translateY(0);
        }}
        .hero {{
            position: relative;
            padding: 160px 0 100px;
            background: url('{2}') center/cover no-repeat;
            border-radius: 0 0 var(--rounded-xl) var(--rounded-xl);
            margin-bottom: var(--space-xl);
        }}
        .hero-overlay {{
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%);
            border-radius: 0 0 var(--rounded-xl) var(--rounded-xl);
        }}
        .hero-content {{
            position: relative;
            z-index: 1;
            color: white;
            max-width: 800px;
        }}
    </style>
</head>
<body>
    <nav class="navbar" style="background: rgba(255,255,255,0.95); backdrop-filter: blur(10px);">
        <div class="container">
            <a href="index.html" class="brand-logo">
                <div class="brand-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                Raahi
            </a>
            <div class="nav-links">
                <a href="about.html" class="nav-link">Our Story</a>
                <a href="index.html#features" class="nav-link">How it works</a>
                <a href="help.html" class="nav-link">Contact</a>
            </div>
            <div class="nav-actions">
                <a href="login.html" class="nav-link">Log in</a>
                <a href="register.html" class="btn btn-primary btn-pill">Sign up</a>
            </div>
        </div>
    </nav>

    <main>
        <section class="hero fade-up">
            <div class="hero-overlay"></div>
            <div class="container hero-content text-center">
                <h1 class="text-display-lg mb-md" style="color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">{0}</h1>
                <p class="text-body-lg" style="color: rgba(255,255,255,0.9); font-size: 20px;">{1}</p>
            </div>
        </section>

        <section class="section container fade-up" style="max-width: 800px; line-height: 1.8;">
            {3}
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div>
                    <h4 class="footer-heading">Support</h4>
                    <a href="help.html" class="footer-link">Help Center</a>
                    <a href="safety.html" class="footer-link">Safety Information</a>
                    <a href="cancellation.html" class="footer-link">Cancellation Options</a>
                </div>
                <div>
                    <h4 class="footer-heading">Company</h4>
                    <a href="about.html" class="footer-link">About Us</a>
                    <a href="careers.html" class="footer-link">Careers</a>
                    <a href="investors.html" class="footer-link">Investors</a>
                </div>
                <div>
                    <h4 class="footer-heading">Platform</h4>
                    <a href="dashboard.html" class="footer-link">Dashboard</a>
                    <a href="tracking.html" class="footer-link">Live Tracking</a>
                    <a href="sos.html" class="footer-link">SOS Emergency</a>
                </div>
                <div>
                    <h4 class="footer-heading">Legal</h4>
                    <a href="terms.html" class="footer-link">Terms of Service</a>
                    <a href="privacy.html" class="footer-link">Privacy Policy</a>
                </div>
            </div>
            <div class="footer-bottom">
                <div>© 2026 Raahi, Inc.</div>
            </div>
        </div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', () => {{
            const observer = new IntersectionObserver((entries) => {{
                entries.forEach(entry => {{
                    if (entry.isIntersecting) {{
                        entry.target.classList.add('visible');
                    }}
                }});
            }}, {{ threshold: 0.1 }});

            document.querySelectorAll('.fade-up').forEach((el) => {{
                observer.observe(el);
            }});
        }});
    </script>
</body>
</html>
"@

foreach ($key in $pages.Keys) {
    $p = $pages[$key]
    $content = $template -f $p.title, $p.desc, $p.img, $p.content
    Set-Content -Path "c:\Users\91620\raahi\frontend\$($key)" -Value $content -Encoding UTF8
}

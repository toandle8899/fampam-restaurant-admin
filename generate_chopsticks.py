import math

def generate_chopstick_svg(grab=False):
    # grab means the tips are pinched together, the tops are spread apart
    
    # Original normal:
    # 1: (2,36) to (36,2)
    # 2: (8,36) to (38,6)
    
    if grab:
        # T1 (bottom tip) pinched at (5,36)
        # T2 (top end) spread
        c1_b = (5, 36)
        c1_t = (32, 2)
        c2_b = (5, 36)
        c2_t = (42, 6)
    else:
        c1_b = (2, 36)
        c1_t = (36, 2)
        c2_b = (8, 36)
        c2_t = (38, 6)

    def get_poly(b, t, w_b, w_t):
        dx = t[0] - b[0]
        dy = t[1] - b[1]
        length = math.hypot(dx, dy)
        nx = -dy / length
        ny = dx / length
        
        p1 = (b[0] + nx * w_b, b[1] + ny * w_b)
        p2 = (b[0] - nx * w_b, b[1] - ny * w_b)
        p3 = (t[0] - nx * w_t, t[1] - ny * w_t)
        p4 = (t[0] + nx * w_t, t[1] + ny * w_t)
        
        return f"{p1[0]:.1f},{p1[1]:.1f} {p2[0]:.1f},{p2[1]:.1f} {p3[0]:.1f},{p3[1]:.1f} {p4[0]:.1f},{p4[1]:.1f}"

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 40 40" fill="none">
  <g transform="translate(1 1)">
    <!-- Chopstick 1 Outline -->
    <polygon points="{get_poly(c1_b, c1_t, 1.2, 3.2)}" fill="#111" stroke="#111" stroke-width="1.5" stroke-linejoin="round" />
    <!-- Chopstick 1 Fill -->
    <polygon points="{get_poly(c1_b, c1_t, 0.4, 2.4)}" fill="#d4a373" stroke="#d4a373" stroke-width="1" stroke-linejoin="round" />
    
    <!-- Chopstick 2 Outline -->
    <polygon points="{get_poly(c2_b, c2_t, 1.2, 3.2)}" fill="#111" stroke="#111" stroke-width="1.5" stroke-linejoin="round" />
    <!-- Chopstick 2 Fill -->
    <polygon points="{get_poly(c2_b, c2_t, 0.4, 2.4)}" fill="#c69963" stroke="#c69963" stroke-width="1" stroke-linejoin="round" />
  </g>
</svg>"""
    return svg

with open('public/chopsticks.svg', 'w') as f:
    f.write(generate_chopstick_svg(False))

with open('public/chopsticks-grab.svg', 'w') as f:
    f.write(generate_chopstick_svg(True))

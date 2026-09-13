"""Generate the three Chrome icon sizes from one simple vector drawing."""

from pathlib import Path
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "assets"
OUTPUT.mkdir(exist_ok=True)


def make_icon(size: int) -> None:
    scale = 8
    canvas_size = size * scale
    image = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    def box(coords):
        return tuple(round(value * canvas_size) for value in coords)

    draw.rounded_rectangle(box((0.03, 0.03, 0.97, 0.97)),
                           radius=round(canvas_size * 0.22), fill="#812c4b")
    draw.rounded_rectangle(box((0.25, 0.16, 0.75, 0.84)),
                           radius=round(canvas_size * 0.055), fill="#fffafc")
    draw.polygon([(round(0.60 * canvas_size), round(0.16 * canvas_size)),
                  (round(0.75 * canvas_size), round(0.31 * canvas_size)),
                  (round(0.60 * canvas_size), round(0.31 * canvas_size))],
                 fill="#d8b4c2")
    draw.line(box((0.34, 0.39, 0.62, 0.39)), fill="#b9a4ae", width=round(canvas_size * 0.035))
    draw.line(box((0.34, 0.48, 0.54, 0.48)), fill="#b9a4ae", width=round(canvas_size * 0.035))

    cx, cy = 0.55 * canvas_size, 0.64 * canvas_size
    radius = 0.125 * canvas_size
    draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill="#812c4b")
    cut_radius = radius * 0.83
    draw.ellipse((cx - cut_radius + radius * 0.42,
                  cy - cut_radius - radius * 0.30,
                  cx + cut_radius + radius * 0.42,
                  cy + cut_radius - radius * 0.30), fill="#fffafc")

    image.resize((size, size), Image.Resampling.LANCZOS).save(OUTPUT / f"icon{size}.png")


for icon_size in (16, 48, 128):
    make_icon(icon_size)

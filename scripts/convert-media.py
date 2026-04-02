import os
import subprocess
import shutil

GIF_DIR = "./assets/gifs"
WEBM_DIR = "./assets/webm"
PUBLIC_DIR = "./public/projects"

os.makedirs(WEBM_DIR, exist_ok=True)
os.makedirs(PUBLIC_DIR, exist_ok=True)

def convert(input_path, output_path):
    command = [
        'ffmpeg',
        '-y',
        '-i', input_path,
        '-vf', 'fps=15,scale=720:-1:flags=lanczos',
        '-c:v', 'libvpx-vp9',
        '-pix_fmt', 'yuv420p',
        '-b:v', '0',
        '-crf', '30',
        '-an',
        output_path
    ]

    result = subprocess.run(
        command,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    if result.returncode != 0:
        print(f"[!] Conversion failed: {input_path}")
        print(result.stderr)
        return False

    return True


def main():
    print("Current directory:", os.getcwd())

    if not os.path.exists(GIF_DIR):
        print(f"[!] GIF directory not found: {GIF_DIR}")
        return

    files = os.listdir(GIF_DIR)
    gif_files = [f for f in files if f.lower().endswith(".gif")]

    print(f"Found GIF files: {len(gif_files)}")

    if not gif_files:
        print("[!] There are no GIF files to convert.")
        return

    for file in gif_files:
        gif_path = os.path.join(GIF_DIR, file)
        webm_name = os.path.splitext(file)[0] + ".webm"
        webm_path = os.path.join(WEBM_DIR, webm_name)
        public_path = os.path.join(PUBLIC_DIR, webm_name)

        # 이미 변환된 경우 skip
        if os.path.exists(webm_path) and os.path.getsize(webm_path) > 1000:
            print(f"Already exists: {webm_name}")
        else:
            print(f"Converting: {file} → {webm_name}")
            success = convert(gif_path, webm_path)
            if not success:
                continue

        # public 복사
        shutil.copy(webm_path, public_path)
        print(f"Copy complete → public/projects/{webm_name}")

    print("Done")


if __name__ == "__main__":
    main()
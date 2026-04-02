import os
import subprocess
import shutil

INPUT_DIR = "./assets/gifs"   # GIF + MP4 모두 여기에 넣는다고 가정
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
        print("Conversion failed:", input_path)
        print(result.stderr)
        return False

    return True


def main():
    print("Current directory:", os.getcwd())

    if not os.path.exists(INPUT_DIR):
        print("Input directory not found:", INPUT_DIR)
        return

    files = os.listdir(INPUT_DIR)

    # GIF + MP4 둘 다 처리
    target_files = [
        f for f in files
        if f.lower().endswith(".gif") or f.lower().endswith(".mp4")
    ]

    print("Found files:", len(target_files))

    if not target_files:
        print("No files to convert.")
        return

    for file in target_files:
        input_path = os.path.join(INPUT_DIR, file)
        webm_name = os.path.splitext(file)[0] + ".webm"
        webm_path = os.path.join(WEBM_DIR, webm_name)
        public_path = os.path.join(PUBLIC_DIR, webm_name)

        if os.path.exists(webm_path) and os.path.getsize(webm_path) > 1000:
            print("Already exists:", webm_name)
        else:
            print("Converting:", file, "->", webm_name)
            success = convert(input_path, webm_path)
            if not success:
                continue

        shutil.copy(webm_path, public_path)
        print("Copied to public/projects:", webm_name)

    print("Done")


if __name__ == "__main__":
    main()
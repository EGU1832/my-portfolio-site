import os
import subprocess
import shutil

INPUT_DIR = "./assets/gifs"
WEBM_DIR = "./assets/webm"
PUBLIC_DIR = "./public/projects"
THUMB_DIR = "./public/projects/thumbs"

os.makedirs(WEBM_DIR, exist_ok=True)
os.makedirs(PUBLIC_DIR, exist_ok=True)
os.makedirs(THUMB_DIR, exist_ok=True)


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


# 썸네일 추출
def extract_thumbnail(input_path, output_path):
    command = [
        'ffmpeg',
        '-y',
        '-i', input_path,
        '-frames:v', '1',
        '-c:v', 'libwebp',
        '-quality', '85',
        '-compression_level', '6',
        output_path
    ]

    result = subprocess.run(
        command,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    if result.returncode != 0:
        print("Thumbnail extraction failed:", input_path)
        print(result.stderr)
        return False

    return True


def main():
    print("Current directory:", os.getcwd())

    if not os.path.exists(INPUT_DIR):
        print("Input directory not found:", INPUT_DIR)
        return

    files = os.listdir(INPUT_DIR)

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

        base_name = os.path.splitext(file)[0]

        # webm
        webm_name = base_name + ".webm"
        webm_path = os.path.join(WEBM_DIR, webm_name)
        public_webm_path = os.path.join(PUBLIC_DIR, webm_name)

        # thumbnail
        thumb_name = base_name + ".webp"
        thumb_path = os.path.join(THUMB_DIR, thumb_name)

        # 1. WEBM 변환
        if os.path.exists(webm_path) and os.path.getsize(webm_path) > 1000:
            print("Already exists:", webm_name)
        else:
            print("Converting:", file, "->", webm_name)
            success = convert(input_path, webm_path)
            if not success:
                continue

        shutil.copy(webm_path, public_webm_path)
        print("Copied:", webm_name)

        # 2. 썸네일 생성
        if os.path.exists(thumb_path):
            print("Thumbnail exists:", thumb_name)
        else:
            print("Extracting thumbnail:", thumb_name)
            extract_thumbnail(input_path, thumb_path)

    print("Done")


if __name__ == "__main__":
    main()
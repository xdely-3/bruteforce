import zipfile
import os

def extract_zip(zip_file_path, password_file_path, output_directory):
    # Validasi keberadaan file ZIP dan wordlist
    if not os.path.isfile(zip_file_path):
        print(f"Error: File ZIP '{zip_file_path}' tidak ditemukan.")
        return False

    if not os.path.isfile(password_file_path):
        print(f"Error: File wordlist '{password_file_path}' tidak ditemukan.")
        return False

    # Membaca daftar kata sandi dari file wordlist
    try:
        with open(password_file_path, 'r', encoding='latin-1') as password_file:
            passwords = password_file.readlines()
    except Exception as e:
        print(f"Error saat membuka file wordlist: {e}")
        return False

    # Membuat direktori output jika belum ada
    os.makedirs(output_directory, exist_ok=True)

    # Mencoba mengekstrak file ZIP dengan setiap kata sandi
    try:
        with zipfile.ZipFile(zip_file_path) as zip_file:
            for password in passwords:
                password = password.strip()  # Menghapus spasi atau karakter newline
                try:
                    zip_file.extractall(path=output_directory, pwd=password.encode('latin-1'))
                    print(f"File ZIP berhasil diekstrak dengan kata sandi: '{password}'")
                    return True
                except (RuntimeError, zipfile.BadZipFile):
                    # Kata sandi salah, lanjutkan ke kata sandi berikutnya
                    continue
                except Exception as e:
                    print(f"Error saat mencoba kata sandi '{password}': {e}")
                    continue

        print("Kata sandi tidak ditemukan di dalam daftar.")
        return False

    except zipfile.BadZipFile:
        print(f"Error: File '{zip_file_path}' bukan file ZIP yang valid.")
        return False
    except Exception as e:
        print(f"Error saat membuka file ZIP: {e}")
        return False

def main():
    # Input file ZIP, wordlist, dan direktori output
    zip_file_path = input("Masukkan path file ZIP: ").strip()
    password_file_path = input("Masukkan path file wordlist: ").strip()
    output_directory = input("Masukkan direktori output (default: 'extracted_files'): ").strip() or 'extracted_files'

    print(f"Mencoba mengekstrak '{zip_file_path}' dengan kata sandi dari '{password_file_path}'...")
    success = extract_zip(zip_file_path, password_file_path, output_directory)

    if success:
        print("Proses selesai dengan sukses.")
    else:
        print("Proses selesai, tetapi file tidak dapat diekstrak.")

if __name__ == '__main__':
    main()

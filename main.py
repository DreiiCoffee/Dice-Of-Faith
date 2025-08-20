import sys
import subprocess
from pathlib import Path


def ensure_pywebview_installed():
	try:
		import webview
		return webview
	except ImportError:
		print("pywebview not found. Attempting to install it now...")
		try:
			subprocess.check_call([sys.executable, "-m", "pip", "install", "--user", "pywebview"])
		except Exception as install_error:
			print(f"Automatic install failed: {install_error}")
			return None
		try:
			import webview
			return webview
		except Exception:
			return None


def get_index_html_uri() -> str:
	root_dir = Path(__file__).resolve().parent
	index_html = root_dir / "web" / "index.html"
	if not index_html.exists():
		raise FileNotFoundError(f"Missing file: {index_html}")
	return index_html.as_uri()


def main() -> None:
	index_uri = get_index_html_uri()
	webview_mod = ensure_pywebview_installed()
	if webview_mod is None:
		raise RuntimeError(
			"pywebview is required to run the embedded UI. Install failed. "
			"Please run: python -m pip install pywebview, then try again."
		)

	try:
		window = webview_mod.create_window("Dice of Fate 3D", index_uri, width=1000, height=700, resizable=True)
		webview_mod.start(gui="edgechromium")
	except Exception as err:
		raise RuntimeError(
			"Failed to start the embedded window. On Windows, please install the 'Microsoft Edge WebView2 Runtime' and try again."
		) from err


if __name__ == "__main__":
	try:
		main()
	except Exception as error:
		print(f"Failed to launch: {error}")
		sys.exit(1)



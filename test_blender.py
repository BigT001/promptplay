import bpy

def test_blender():
    try:
        print("Blender version:", bpy.app.version_string)
        return True
    except:
        return False

if __name__ == "__main__":
    if test_blender():
        print("Blender Python API (bpy) is working correctly!")
    else:
        print("Could not access Blender Python API. Make sure Blender's Python is in your PATH.")

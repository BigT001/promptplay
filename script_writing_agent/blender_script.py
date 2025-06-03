import bpy
import json
import sys
import os
import requests

class BlenderSceneGenerator:
    def __init__(self):
        self.current_scene = None
        self.using_sketchfab = False
        
        # Try BlenderKit first
        if "blenderkit" in bpy.context.preferences.addons:
            api_key = os.getenv("BLENDERKIT_API_KEY")
            if api_key and api_key != "your_blenderkit_api_key_here":
                bpy.context.preferences.addons["blenderkit"].preferences.api_key = api_key
                return
                
        # Fallback to Sketchfab
        self.using_sketchfab = True
        self.sketchfab_api_key = os.getenv("SKETCHFAB_API_KEY")
        
    def download_sketchfab_model(self, query: str) -> str:
        """Download a 3D model from Sketchfab based on search query"""
        if not self.sketchfab_api_key:
            return None
            
        headers = {'Authorization': f'Token {self.sketchfab_api_key}'}
        search_url = f'https://api.sketchfab.com/v3/models?q={query}&downloadable=true'
        
        try:
            response = requests.get(search_url, headers=headers)
            results = response.json()
            
            if results.get('results'):
                model = results['results'][0]
                model_url = f"https://api.sketchfab.com/v3/models/{model['uid']}/download"
                
                dl_response = requests.get(model_url, headers=headers)
                dl_data = dl_response.json()
                
                if dl_data.get('gltf', {}).get('url'):
                    # Download the model file
                    model_file = os.path.join(os.path.dirname(bpy.data.filepath), f"{query}.glb")
                    with open(model_file, 'wb') as f:
                        f.write(requests.get(dl_data['gltf']['url']).content)
                    return model_file
        except Exception as e:
            print(f"Sketchfab download error: {e}")
        return None
        
    def setup_scene(self, scene_data: dict):
        # Clear existing scene
        bpy.ops.object.select_all(action='SELECT')
        bpy.ops.object.delete()
        
        # Set render settings
        bpy.context.scene.render.engine = 'CYCLES'
        bpy.context.scene.render.film_transparent = True
        bpy.context.scene.render.resolution_x = scene_data.get('resolution_x', 1920)
        bpy.context.scene.render.resolution_y = scene_data.get('resolution_y', 1080)
        bpy.context.scene.render.fps = scene_data.get('fps', 24)
        
        # Setup camera
        bpy.ops.object.camera_add()
        camera = bpy.context.active_object
        bpy.context.scene.camera = camera
        
        # Setup lighting
        bpy.ops.object.light_add(type='SUN')
        sun = bpy.context.active_object
        sun.location = (5, 5, 10)
        sun.rotation_euler = (0.5, 0.2, 0)
        
    def add_character(self, character_data: dict):
        # For now, create a simple placeholder character
        # TODO: Replace with proper character models using BlenderKit
        bpy.ops.mesh.primitive_cylinder_add(radius=0.5, depth=2)
        character = bpy.context.active_object
        character.name = character_data.get('name', 'Character')
        
        # Add a sphere for the head
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.3)
        head = bpy.context.active_object
        head.location = (0, 0, 1.3)
        head.name = f"{character.name}_head"
        
        # Parent head to body
        head.parent = character
        
        return character
        
    def setup_environment(self, scene_data: dict):
        # Create ground plane
        bpy.ops.mesh.primitive_plane_add(size=20)
        ground = bpy.context.active_object
        ground.name = "Ground"
        
        # Add a simple material
        mat = bpy.data.materials.new(name="GroundMaterial")
        mat.use_nodes = True
        ground.data.materials.append(mat)
        
        # TODO: Use BlenderKit to fetch appropriate environment assets
        # based on scene_data['environment'] description
        
        return ground
        
    def set_camera_position(self, camera_data: dict):
        camera = bpy.context.scene.camera
        if camera and camera_data:
            camera.location = camera_data.get('location', (0, -10, 5))
            camera.rotation_euler = camera_data.get('rotation', (1.0, 0, 0))
            
    def create_animation(self, scene_data: dict):
        # Set timeline length
        bpy.context.scene.frame_start = 1
        bpy.context.scene.frame_end = scene_data.get('duration_frames', 250)
        
        # Set up basic animation
        for obj in bpy.data.objects:
            if obj.type == 'CAMERA':
                continue
                
            # Add random rotation animation
            obj.rotation_euler = (0, 0, 0)
            obj.keyframe_insert(data_path="rotation_euler", frame=1)
            
            obj.rotation_euler = (0, 0, 0.5)
            obj.keyframe_insert(data_path="rotation_euler", frame=125)
            
            obj.rotation_euler = (0, 0, 0)
            obj.keyframe_insert(data_path="rotation_euler", frame=250)
        
    def render_scene(self, output_path: str):
        # Set output path and format
        bpy.context.scene.render.filepath = output_path
        bpy.context.scene.render.image_settings.file_format = 'FFMPEG'
        bpy.context.scene.render.ffmpeg.format = 'MPEG4'
        bpy.context.scene.render.ffmpeg.codec = 'H264'
        
        # Set quality
        bpy.context.scene.render.ffmpeg.constant_rate_factor = 'HIGH'
        
        # Render animation
        bpy.ops.render.render(animation=True)

def main():
    # Get the input file path from command line arguments
    input_file = sys.argv[-1]
    
    # Load the input data
    with open(input_file, 'r') as f:
        data = json.load(f)
    
    script = data['script']
    scene_metadata = data['scene_metadata']
    character_info = data['character_info']
    
    try:
        generator = BlenderSceneGenerator()
        
        # Setup the scene
        generator.setup_scene(scene_metadata)
        
        # Add characters
        for char_data in character_info.get('characters', []):
            generator.add_character(char_data)
            
        # Setup environment
        generator.setup_environment(scene_metadata)
        
        # Set camera
        generator.set_camera_position(scene_metadata.get('camera', {}))
        
        # Create animation
        generator.create_animation(scene_metadata)
        
        # Generate output paths
        output_dir = os.path.join(os.path.dirname(input_file), 'output')
        os.makedirs(output_dir, exist_ok=True)
        
        blend_path = os.path.join(output_dir, 'scene.blend')
        video_path = os.path.join(output_dir, 'animation.mp4')
        
        # Save .blend file
        bpy.ops.wm.save_as_mainfile(filepath=blend_path)
        
        # Render animation
        generator.render_scene(video_path)
        
        result = {
            "status": "success",
            "files": {
                "blend_file": blend_path,
                "video_file": video_path
            },
            "metadata": {
                "frames": bpy.context.scene.frame_end,
                "duration": bpy.context.scene.frame_end / bpy.context.scene.render.fps
            }
        }
        
    except Exception as e:
        result = {
            "status": "error",
            "error_message": str(e)
        }
    
    # Save the result
    with open(input_file + '.result', 'w') as f:
        json.dump(result, f)

if __name__ == "__main__":
    main()

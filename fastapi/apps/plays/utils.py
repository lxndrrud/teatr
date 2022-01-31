from fastapi import UploadFile
from typing import Optional
import os


def image_saving(image: Optional[UploadFile]) -> Optional[str]:
    if image:
        try:
            with open(image.file, 'rb') as f:
                content = f.read()
                filepath = os.path.join(os.path.dirname(__file__), "../../storage")
                with open(f"{filepath}/{image.filename}", 'wb') as new_file:
                    new_file.write(content)
                return f"{filepath}/{image.filename}"
        except:
            print('Error saving image in filesystem!')
            return None
    else: 
        return None

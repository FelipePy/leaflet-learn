import rasterio
from rasterio.plot import show
from rasterio.mask import mask
import geopandas as gpd

# Abrir o arquivo GeoTIFF
with rasterio.open('S11635296_202410171800.tif') as dataset:
    # Imprimir informações sobre o arquivo
     # Ler a primeira banda
    shapes = gpd.read_file('area_interesse.shp')
    
    # Mascarar (recortar) o raster com o polígono
    out_image, out_transform = mask(dataset, shapes.geometry, crop=True)
    
    # Plotar o resultado
    show(out_image)
import rasterio
import geopandas as gpd
from shapely.geometry import box

# Abra o GeoTIFF
with rasterio.open("S11635296_202410171800.tif") as src:
    data = src.read(1)  # Leia a primeira banda (ou combine conforme necessário)
    transform = src.transform

# Crie polígonos ou pontos para valores específicos
geometries = []
for row in range(data.shape[0]):
    for col in range(data.shape[1]):
        value = data[row, col]
        if value > 0:  # Apenas valores maiores que 0, ajuste conforme necessário
            # Calcule a coordenada geográfica para o pixel
            x, y = transform * (col, row)
            geometries.append(box(x, y, x + transform[0], y + transform[4]))

# Converta em GeoDataFrame
gdf = gpd.GeoDataFrame(geometry=geometries)
gdf.to_file("dados.geojson", driver="GeoJSON")
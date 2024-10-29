import rasterio
import matplotlib.pyplot as plt
import xarray as xr
import os

output_dir = './imagens'

os.makedirs(output_dir, exist_ok=True)

file_path = "./S11635296_202410171800.tif"
with rasterio.open(file_path) as dataset:
    numero_de_bandas = dataset.count

    # Define os limites para a América do Sul
    min_lat, min_lon = -60.0, -100.0  # Coordenadas do canto sudoeste
    max_lat, max_lon = 30.0, -10.0    # Coordenadas do canto nordeste

    # Converte as coordenadas geográficas para índices de pixel
    row_min, col_min = dataset.index(min_lon, max_lat)
    row_max, col_max = dataset.index(max_lon, min_lat)

    # Leia os dados do arquivo para uma banda específica (ex: banda 1)
    for i in range(1, numero_de_bandas + 1):
        banda = dataset.read(i)  # Lê a primeira banda
        banda_cortada = banda[row_min:row_max, col_min:col_max]  # Recorta a banda

        # Plota a imagem da banda cortada
        plt.figure(figsize=(10, 10))  # Ajuste o tamanho conforme necessário
        plt.imshow(banda_cortada, cmap='gray', vmin=banda.min(), vmax=banda.max())
        plt.axis('off')  # Remove os eixos
        plt.savefig(f'imagens/banda{i}_amazonia.png', bbox_inches='tight', pad_inches=0)  # Salva a imagem sem margens
        plt.close()

file_path = "./S10635346_202410171800.nc"

# Abre o arquivo NetCDF
with xr.open_dataset(file_path) as dataset:
    for var_name in dataset.variables:
        # Acessa a variável
        var_data = dataset[var_name]

        if var_data.ndim == 2:
            plt.imshow(var_data, cmap='gray')
            plt.colorbar(label='Valores')
            plt.title(f'Visualização da variável: {var_name}')
            # plt.show()

            output_file = os.path.join(output_dir, f'{var_name}.png')  # Ou .jpg para JPEG
            plt.savefig(output_file, bbox_inches='tight') 
            plt.close() 

            print(f'Imagem salva como: {output_file}')
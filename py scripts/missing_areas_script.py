# ------------------------------------------------------------------------------
# Title: Missing areas of AFT and AHe basement data with and without respect to quaternary faults
# Description: The following python script is used to generate areas of missing data for AFT and AHe with and without respect to faults. Buffers for distance from samples are 10km, 25km, 50km, and 100km. With respect to faults uses a 50km range.
# From: GEOG 778 Project
# Author: Alice G. Morris
# Github repo: https://github.com/AliceGMorris/GEOG778-Project
# Github page: https://alicegmorris.github.io/GEOG778-Project/
# © 2024 Alice G. Morris
# ------------------------------------------------------------------------------

import arcpy
import sys

arcpy.env.overwriteOutput = True

# Change path to where all data is located
path = "C:\data"

arcpy.env.workspace = path

# Required Files:
# ------------------------------------------------------------------------------
# Most files are located in data folder and any subfolders (See github repo)
# Input Files
# ------------------------------------------------------------------------------
faults = "mp141-qflt-line-alaska.shp" # Koehler, R.D., 2013 (See github repo or readme.md in data for download)

AFT_Data = "AFTData.csv" # See readme.md in data for specific papers (See github repo for download)
AHe_Data = "AHeData.csv" # See readme.md in data for specific papers (See github repo for download)

GeologyPoly = "AKStategeol_poly.shp" # Wilson, F.H., Hults, C.P., Mull, C.G, and Karl, S.M, comps., 2015 (See readme.md in github repo data folder for download)

GeologyCSV = "Geology.csv" # Adapted from: Wilson, F.H., Hults, C.P., Mull, C.G., and Karl, S.M., comps., 2015 (See github repo for download)

# Extent of thermo data
AFTBorder = "AFTBorder.shp" # (See github repo for download)
AHeBorder = "AHeBorder.shp" # (See github repo for download)
# ------------------------------------------------------------------------------


# Output features
# ------------------------------------------------------------------------------
# Temp files
# All temp files get deleted
# ------------------------------------------------------------------------------
GeoBed = "GeoBed"
GeoAFTClip = "GeoAFTClip"
GeoAHeClip = "GeoAHeClip"
AFT = "AFT"
AHe = "AHe"
AFTBuffer = ["AFT_Buffer10", "AFT_Buffer25", "AFT_Buffer50", "AFT_Buffer100"]
AHeBuffer = ["AHe_Buffer10", "AHe_Buffer25", "AHe_Buffer50", "AHe_Buffer100"]
faultBuffer = "faultBuffer"
# ------------------------------------------------------------------------------
# Main outputs
# ------------------------------------------------------------------------------
AFTClip = ["AFT_Clip10", "AFT_Clip25", "AFT_Clip50", "AFT_Clip100"]
AHeClip = ["AHe_Clip10", "AHe_Clip25", "AHe_Clip50", "AHe_Clip100"]
AFTFaultClip = ["AFT_FaultClip10", "AFT_FaultClip25", "AFT_FaultClip50", "AFT_FaultClip100"]
AHeFaultClip = ["AHe_FaultClip10", "AHe_FaultClip25", "AHe_FaultClip50", "AHe_FaultClip100"]
# ------------------------------------------------------------------------------


# Additional variables
# ------------------------------------------------------------------------------
# SQL statement used for geology poly
sql = "Geology.csv.Generalized LIKE '%INTRUSIVE ROCKS%' OR Geology.csv.Generalized LIKE '%METAMORPHIC ROCKS%' OR Geology.csv.Generalized LIKE '%TECTONIC ASSEMBLAGES AND MÉLANGE%' OR Geology.csv.Generalized LIKE '%VOLCANIC ROCKS%' OR Geology.csv.Generalized LIKE '%BEDROCK%'"

# Buffer variable
Buffer = ["10 Kilometers", "25 Kilometers", "50 Kilometers", "100 Kilometers"]
# ------------------------------------------------------------------------------


# Program:
# ------------------------------------------------------------------------------
try:
    # Join geology csv to the geology polygon to get generalized geology
    Geojoin = arcpy.management.AddJoin(GeologyPoly, "STATE_LABE", GeologyCSV, "Map Unit")
    print("Join complete")

    # Export the join
    arcpy.conversion.ExportFeatures(Geojoin, GeoBed, sql)
    print("Export feature complete")

    # Clean up folder by removing unneeded data
    arcpy.management.Delete(Geojoin)
    print("Delete complete")

    # Clip the geology to the extent of the two samples
    arcpy.analysis.Clip(GeoBed, AFTBorder, GeoAFTClip)
    arcpy.analysis.Clip(GeoBed, AHeBorder, GeoAHeClip)
    print("Clip complete")

    # Clean up folder by removing unneeded data
    arcpy.management.Delete(GeoBed)
    print("Delete complete")

    # Create sample locations
    arcpy.management.XYTableToPoint(AFT_Data, AFT, "Long", "Lat")
    arcpy.management.XYTableToPoint(AHe_Data, AHe, "Long", "Lat")
    print("csv to point complete")

    # Create 10km, 25km, 50km, and 100km buffers for AFT and AHe data
    for i in range(len(Buffer)):
        arcpy.analysis.Buffer(AFT, AFTBuffer[i], Buffer[i])
        arcpy.analysis.Buffer(AHe, AHeBuffer[i], Buffer[i])
    print("Point buffers complete")

    # Clean up folder by removing unneeded data
    arcpy.management.Delete(AFT)
    arcpy.management.Delete(AHe)
    print("Delete complete")

    # Create 10km, 25km, 50km, and 100km areas for AFT and AHe data by erasing areas that are too close
    for i in range(len(Buffer)):
        arcpy.analysis.Erase(GeoAFTClip, AFTBuffer[i], AFTClip[i])
        arcpy.analysis.Erase(GeoAHeClip, AHeBuffer[i], AHeClip[i])
    print("Point erases complete")

    # Clean up folder by removing unneeded data
    arcpy.management.Delete(GeoAFTClip)
    arcpy.management.Delete(GeoAHeClip)
    for i in range(len(Buffer)):
        arcpy.management.Delete(AFTBuffer[i])
        arcpy.management.Delete(AHeBuffer[i])
    print("Delete complete")

    # Create 50km buffer for faults
    arcpy.analysis.Buffer(faults, faultBuffer, Buffer[2])
    print("Fault buffer complete")

    # Clip 10km, 25km, 50km, and 100km areas to within 50km of a quaternary faults
    for i in range(len(Buffer)):
        arcpy.analysis.Clip(AFTClip[i], faultBuffer, AFTFaultClip[i])
        arcpy.analysis.Clip(AHeClip[i], faultBuffer, AHeFaultClip[i])
    print("Fault clip complete")

    # Clean up folder by removing unneeded data
    arcpy.management.Delete(faultBuffer)
    print("Delete complete")
    print("Program finished")
except:
    # If the program fails, print error and exit
    print(arcpy.GetMessages())
    sys.exit(1)
# ------------------------------------------------------------------------------
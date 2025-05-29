$Build_Version=$env:APPVEYOR_BUILD_VERSION;
$Apppool_Name=$env:APPLICATION_SITE_NAME;
$Websitefolder='C:\Websites\warmigloos.shop\www'; #$env:APPLICATION_PATH;
$GrantAccessTo="IIS APPPOOL\$Apppool_Name";
$uSync = "uSync"

# Add a fallback to a known user
If($GrantAccessTo -eq 'IIS APPPOOL\'){
    $GrantAccessTo="IIS_IUSRS"
}

# Make sure we're in the right folder
cd $Websitefolder

# Only set umbraco permisisons if it's an Umbraco site
If(test-path "umbraco"){
    Write-Host "Site $Websitefolder looks like an Umbraco instance -setting up" -ForegroundColor Green

	If(test-path $uSync)
    {
        Write-Host "removing uSync files" -ForegroundColor Green
        Get-ChildItem -Path $uSync -Include *.* -Recurse | Remove-Item -recurse   
        
        # add usync.once so that usync import only happens for deploy - import on start needs to be set in the config
        Write-Host "$uSync\v9 - add usync.once so that usync import only happens for deploy" -ForegroundColor Green
        if (-Not (test-path $uSync\v9)){
            New-Item -Path $uSync\v9 -ItemType "directory"
        }
        New-Item -Path $uSync\v9 -Name "usync.once" -ItemType "file"

    }else{
        Write-Host "Couldn't find temp uSync folder: '$uSync'" -ForegroundColor Yellow
    }

}else{
    Write-Host "Site $Websitefolder doesn't look like an Umbraco instance -skipping setting permissions" -ForegroundColor Yellow
}

#rename the app_offline_disabled.htm file to take the app offline.
if (test-path "app_offline_disabled.htm")
{
    Write-Host "rename the app_offline_disabled.htm file to take the app offline" -ForegroundColor Green
    Rename-Item -Path "app_offline_disabled.htm" -NewName "app_offline.htm"
}

# Useful for debugging variables
# Get-ChildItem Env:
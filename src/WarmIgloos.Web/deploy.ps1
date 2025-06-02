$Build_Version=$env:APPVEYOR_BUILD_VERSION;
$Apppool_Name=$env:APPLICATION_SITE_NAME;
$Websitefolder=$env:APPLICATION_PATH;
$GrantAccessTo="IIS APPPOOL\$Apppool_Name";
$SSLValidationPath = ".well-known/pki-validation"
$uSync = "uSync"

# Add a fallback to a known user
If($GrantAccessTo -eq 'IIS APPPOOL\'){
    $GrantAccessTo="IIS_IUSRS"
}

# Make sure we're in the right folder
cd $Websitefolder

# function for DRY
Function SetPermissions{
         Param($_)
         $Path = $_.Fullname
         $Permission = "Modify"
         $GetACL = Get-Acl $Path

         if ($_.PSIsContainer){
             Write-Host -Object "Is folder, setting InheritanceFlags: '$Path'" -ForegroundColor Cyan
             
             $Allinherit = [system.security.accesscontrol.InheritanceFlags]"ContainerInherit, ObjectInherit"
             $Allpropagation = [system.security.accesscontrol.PropagationFlags]"None"
             $AccessRule = New-Object system.security.AccessControl.FileSystemAccessRule($GrantAccessTo, $Permission, $AllInherit, $Allpropagation, "Allow")
         }else{
             $AccessRule = New-Object system.security.AccessControl.FileSystemAccessRule($GrantAccessTo, $Permission, "Allow")
         }
         
         if ($GetACL.Access | Where { $_.IdentityReference -eq $GrantAccessTo}) {
             Write-Host -Object "Modifying Permissions For: '$GrantAccessTo' On: '$Path'" -ForegroundColor Yellow
    
             $AccessModification = New-Object system.security.AccessControl.AccessControlModification
             $AccessModification.value__ = 2
             $Modification = $False
             $GetACL.ModifyAccessRule($AccessModification, $AccessRule, [ref]$Modification) | Out-Null
         } else {
             Write-Host -Object "Adding Permission: '$Permission' For: '$GrantAccessTo' On: '$Path'" -ForegroundColor Yellow
    
             $GetACL.AddAccessRule($AccessRule)
         }
     
         Set-Acl -aclobject $GetACL -Path $Path
     
         Write-Host -Object "Permission: '$Permission' Set For: '$GrantAccessTo'" -ForegroundColor Green
}

# Only set umbraco permisisons if it's an Umbraco site
If((test-path "umbraco")){
    Write-Host -Object "Site $Websitefolder looks like an Umbraco instance" -ForegroundColor Green

    Get-ChildItem -path $Websitefolder | Where { $_.name -eq "App_Plugins"-or $_.name -eq "umbraco"-or $_.name -eq "Views"-or $_.name -eq "uSync"-or $_.name -eq "wwwroot"} | ForEach {
        $Path = $_.Fullname
       
        if ($_.name -eq "wwwroot"){
            Get-ChildItem -path $_ | Where { $_.name -eq "css"-or $_.name -eq "media"-or $_.name -eq "scripts"} | ForEach {
                SetPermissions($_)
            }
        }else{
             SetPermissions($_)
        }
     }
}else{
    Write-Host -Object "Site $Websitefolder doesn't look like an Umbraco instance -skipping setting permissions" -ForegroundColor Yellow
}

#rename the app_offline_disabled.htm file to take the app offline.
if (test-path "app_offline.htm")
{
    Write-Host "remove the app_offline.htm file to bring the app online" -ForegroundColor Green
    Remove-Item -Path "app_offline.htm"
}

# Useful for debugging variables
# Get-ChildItem Env:
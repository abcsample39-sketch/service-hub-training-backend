$apiUrl = "http://localhost:3006"
$rand = Get-Random -Minimum 10000 -Maximum 99999
$providerEmail = "provider_$rand@demo.com"
$customerEmail = "customer_$rand@demo.com"
$password = "Password123"

# 1. Register Provider
Write-Host "Registering Provider ($providerEmail) WITHOUT PHONE..."
$providerBody = @{ email=$providerEmail; password=$password; name="Demo Provider"; role="Provider" } | ConvertTo-Json
try {
    $provider = Invoke-RestMethod -Uri "$apiUrl/auth/register" -Method Post -Body $providerBody -ContentType "application/json"
} catch {
    Write-Host "Error creating provider: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
       $stream = $_.Exception.Response.GetResponseStream()
       $reader = New-Object System.IO.StreamReader($stream)
       $details = $reader.ReadToEnd()
       Write-Host "Details: $details" -ForegroundColor Red
    }
    exit
}
$providerId = $provider.user.id
Write-Host "Provider ID: $providerId" -ForegroundColor Cyan

# 2. Register Customer
Write-Host "Registering Customer ($customerEmail) WITHOUT PHONE..."
$customerBody = @{ email=$customerEmail; password=$password; name="Demo Customer"; role="Customer" } | ConvertTo-Json
try {
    $customer = Invoke-RestMethod -Uri "$apiUrl/auth/register" -Method Post -Body $customerBody -ContentType "application/json"
} catch {
    Write-Host "Error creating customer: $($_.Exception.Message)" -ForegroundColor Red
    exit
}
$customerId = $customer.user.id
Write-Host "Customer ID: $customerId" -ForegroundColor Cyan

# 3. Get Service ID
$services = Invoke-RestMethod -Uri "$apiUrl/services"
$serviceId = $services[0].id
Write-Host "Service ID: $serviceId" -ForegroundColor Cyan

# 4. Create Bookings
$bookings = @(
    @{ status="Pending"; date=(Get-Date).AddDays(2).ToString("yyyy-MM-ddTHH:mm:ssZ") },
    @{ status="Accepted"; date=(Get-Date).AddDays(1).ToString("yyyy-MM-ddTHH:mm:ssZ") },
    @{ status="Completed"; date=(Get-Date).AddDays(-2).ToString("yyyy-MM-ddTHH:mm:ssZ") },
    @{ status="Cancelled"; date=(Get-Date).AddDays(-5).ToString("yyyy-MM-ddTHH:mm:ssZ") }
)

foreach ($b in $bookings) {
   $bookingBody = @{
       providerId = $providerId
       serviceId = $serviceId
       date = $b.date
       customerName = "Demo Customer"
       customerEmail = $customerEmail
       customerPhone = "0987654321"
       address = "123 Demo St"
       customerId = $customerId
   } | ConvertTo-Json

   try {
       $res = Invoke-RestMethod -Uri "$apiUrl/bookings" -Method Post -Body $bookingBody -ContentType "application/json"
       Write-Host "Created Booking ($($b.status)): $($res.id)" -ForegroundColor Green
       
       if ($b.status -ne "Pending") {
           $finalStatus = $b.status
           if ($finalStatus -eq "Accepted") {
               Invoke-RestMethod -Uri "$apiUrl/bookings/$($res.id)/status" -Method Patch -Body (@{ status="Accepted"; providerId=$providerId } | ConvertTo-Json) -ContentType "application/json"
           }
           elseif ($finalStatus -eq "Completed") {
               Invoke-RestMethod -Uri "$apiUrl/bookings/$($res.id)/status" -Method Patch -Body (@{ status="Accepted"; providerId=$providerId } | ConvertTo-Json) -ContentType "application/json"
               Invoke-RestMethod -Uri "$apiUrl/bookings/$($res.id)/status" -Method Patch -Body (@{ status="InProgress"; providerId=$providerId } | ConvertTo-Json) -ContentType "application/json"
               Invoke-RestMethod -Uri "$apiUrl/bookings/$($res.id)/status" -Method Patch -Body (@{ status="Completed"; providerId=$providerId } | ConvertTo-Json) -ContentType "application/json"
           }
           elseif ($finalStatus -eq "Cancelled") {
               Invoke-RestMethod -Uri "$apiUrl/bookings/$($res.id)/status" -Method Patch -Body (@{ status="Accepted"; providerId=$providerId } | ConvertTo-Json) -ContentType "application/json"
               Invoke-RestMethod -Uri "$apiUrl/bookings/$($res.id)/status" -Method Patch -Body (@{ status="Cancelled"; providerId=$providerId } | ConvertTo-Json) -ContentType "application/json"
           }
           Write-Host "Updated status to $finalStatus" -ForegroundColor DarkGreen
       }
   } catch {
       Write-Host "Error creating booking: $_" -ForegroundColor Red
   }
}

Write-Host "`nLogin Credentials:" -ForegroundColor Yellow
Write-Host "Email: $customerEmail" -ForegroundColor Yellow
Write-Host "Password: $password" -ForegroundColor Yellow

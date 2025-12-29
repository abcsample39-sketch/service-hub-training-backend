$categories = @(
    @{ name = "Cleaning"; description = "Home cleaning services including deep cleaning, kitchen, and bathroom cleaning" },
    @{ name = "Plumbing"; description = "Expert plumbing services for repairs, installations, and maintenance" },
    @{ name = "Electrical"; description = "Professional electrical services for home wiring, repairs, and installations" },
    @{ name = "Salon & Spa"; description = "Beauty and spa services at home including haircuts, styling, and facials" },
    @{ name = "Carpentry"; description = "Skilled carpentry services for furniture assembly, repairs, and custom woodwork" },
    @{ name = "Painting"; description = "Interior and exterior house painting services" },
    @{ name = "Appliances"; description = "Repair and maintenance services for home appliances" }
)

$url = "http://localhost:3006/services/categories"

foreach ($cat in $categories) {
    try {
        $body = $cat | ConvertTo-Json
        $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
        Write-Host "Created category: $($cat.name)" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to create category: $($cat.name)" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
}

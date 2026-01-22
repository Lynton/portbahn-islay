import {getCliClient} from 'sanity/cli'

const client = getCliClient()

async function removeLicensingInfo() {
  // Fetch all properties with the old licensingInfo field
  const properties = await client.fetch('*[_type == "property" && defined(licensingInfo)]{ _id, name, licensingInfo }')

  console.log(`Found ${properties.length} properties with old licensingInfo field:`)
  properties.forEach((p: any) => console.log(`  - ${p.name}: ${p.licensingInfo}`))

  if (properties.length === 0) {
    console.log('No properties found with licensingInfo field. All clean!')
    return
  }

  // Unset the licensingInfo field from all properties
  for (const property of properties) {
    await client
      .patch(property._id)
      .unset(['licensingInfo'])
      .commit()
    console.log(`✓ Removed licensingInfo from ${property.name}`)
  }

  console.log('\nDone! Refresh Studio to verify.')
}

removeLicensingInfo().catch(console.error)

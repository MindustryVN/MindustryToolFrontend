import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import vi from '../locales/vi.json';
import en from '../locales/en.json';

const resources = {
	vi: { translation: vi },
	en: { translation: en }
};

i18n.use(Backend)
	.use(initReactI18next)
	.init({
		resources: resources,
		fallbackLng: 'vi',
		debug: true,
		interpolation: {
			escapeValue: false
		}
	});

export default i18n;



//  tag.category.position tag.category.position
//  tag.category.position tag.category.position
//  tag.value.core tag.value.core
//  tag.value.core tag.value.core
//  tag.category.position tag.category.position
//  tag.category.position tag.category.position
//  tag.value.ore tag.value.ore
//  tag.value.ore tag.value.ore
//  tag.category.position tag.category.position
//  tag.category.position tag.category.position
//  tag.value.liquid tag.value.liquid
//  tag.value.liquid tag.value.liquid
//  tag.category.position tag.category.position
//  tag.category.position tag.category.position
//  tag.value.remote tag.value.remote
//  tag.value.remote tag.value.remote
//  tag.category.position tag.category.position
//  tag.category.position tag.category.position
//  tag.value.mass-driver tag.value.mass-driver
//  tag.value.mass-driver tag.value.mass-driver
//  tag.category.position tag.category.position
//  tag.category.position tag.category.position
//  tag.value.any tag.value.any
//  tag.value.any tag.value.any
//  tag.category.unit-tier tag.category.unit-tier
//  tag.category.unit-tier tag.category.unit-tier
//  tag.value.tier1 tag.value.tier1
//  tag.value.tier1 tag.value.tier1
//  tag.category.unit-tier tag.category.unit-tier
//  tag.category.unit-tier tag.category.unit-tier
//  tag.value.tier2 tag.value.tier2
//  tag.value.tier2 tag.value.tier2
//  tag.category.unit-tier tag.category.unit-tier
//  tag.category.unit-tier tag.category.unit-tier
//  tag.value.tier3 tag.value.tier3
//  tag.value.tier3 tag.value.tier3
//  tag.category.unit-tier tag.category.unit-tier
//  tag.category.unit-tier tag.category.unit-tier
//  tag.value.tier4 tag.value.tier4
//  tag.value.tier4 tag.value.tier4
//  tag.category.unit-tier tag.category.unit-tier
//  tag.category.unit-tier tag.category.unit-tier
//  tag.value.tier5 tag.value.tier5
//  tag.value.tier5 tag.value.tier5
//  tag.category.planet-tech tag.category.planet-tech
//  tag.category.planet-tech tag.category.planet-tech
//  tag.value.serpulo tag.value.serpulo
//  tag.value.serpulo tag.value.serpulo
//  tag.category.planet-tech tag.category.planet-tech
//  tag.category.planet-tech tag.category.planet-tech
//  tag.value.erekir tag.value.erekir
//  tag.value.erekir tag.value.erekir
//  tag.category.planet-tech tag.category.planet-tech
//  tag.category.planet-tech tag.category.planet-tech
//  tag.value.any tag.value.any
//  tag.value.any tag.value.any
//  tag.category.item tag.category.item
//  tag.category.item tag.category.item
//  tag.value.copper tag.value.copper
//  tag.value.copper tag.value.copper
//  tag.category.item tag.category.item
//  tag.category.item tag.category.item
//  tag.value.lead tag.value.lead
//  tag.value.lead tag.value.lead
//  tag.category.item tag.category.item
//  tag.category.item tag.category.item
//  tag.value.coal tag.value.coal
//  tag.value.coal tag.value.coal
//  tag.category.item tag.category.item
//  tag.category.item tag.category.item
//  tag.value.scrap tag.value.scrap
//  tag.value.scrap tag.value.scrap
//  tag.category.item tag.category.item
//  tag.category.item tag.category.item
//  tag.value.graphite tag.value.graphite
//  tag.value.graphite tag.value.graphite
//  tag.category.item tag.category.item
//  tag.category.item tag.category.item
//  tag.value.metaglass tag.value.metaglass
//  tag.value.metaglass tag.value.metaglass
//  tag.category.item tag.category.item
//  tag.category.item tag.category.item
//  tag.value.silicon tag.value.silicon
//  tag.value.silicon tag.value.silicon
//  tag.category.item tag.category.item
//  tag.category.item tag.category.item
//  tag.value.spore tag.value.spore
//  tag.value.spore tag.value.spore
//  tag.category.item tag.category.item
//  tag.category.item tag.category.item
//  tag.value.titanium tag.value.titanium
//  tag.value.titanium tag.value.titanium
//  tag.category.item tag.category.item
//  tag.category.item tag.category.item
//  tag.value.plastanium tag.value.plastanium
//  tag.value.plastanium tag.value.plastanium
//  tag.category.item tag.category.item
//  tag.category.item tag.category.item
//  tag.value.pyratite tag.value.pyratite
//  tag.value.pyratite tag.value.pyratite
//  tag.category.item tag.category.item
//  tag.category.item tag.category.item
//  tag.value.blast tag.value.blast
//  tag.value.blast tag.value.blast
//  tag.category.item tag.category.item
//  tag.category.item tag.category.item
//  tag.value.thorium tag.value.thorium
//  tag.value.thorium tag.value.thorium
//  tag.category.item tag.category.item
//  tag.category.item tag.category.item
//  tag.value.phase-fabric tag.value.phase-fabric
//  tag.value.phase-fabric tag.value.phase-fabric
//  tag.category.item tag.category.item
//  tag.category.item tag.category.item
//  tag.value.surge-alloy tag.value.surge-alloy
//  tag.value.surge-alloy tag.value.surge-alloy
//  tag.category.item tag.category.item
//  tag.category.item tag.category.item
//  tag.value.beryllium tag.value.beryllium
//  tag.value.beryllium tag.value.beryllium
//  tag.category.item tag.category.item
//  tag.category.item tag.category.item
//  tag.value.tungsten tag.value.tungsten
//  tag.value.tungsten tag.value.tungsten
//  tag.category.item tag.category.item
//  tag.category.item tag.category.item
//  tag.value.oxide tag.value.oxide
//  tag.value.oxide tag.value.oxide
//  tag.category.item tag.category.item
//  tag.category.item tag.category.item
//  tag.value.carbide tag.value.carbide
//  tag.value.carbide tag.value.carbide
//  tag.category.liquid tag.category.liquid
//  tag.category.liquid tag.category.liquid
//  tag.value.water tag.value.water
//  tag.value.water tag.value.water
//  tag.category.liquid tag.category.liquid
//  tag.category.liquid tag.category.liquid
//  tag.value.slag tag.value.slag
//  tag.value.slag tag.value.slag
//  tag.category.liquid tag.category.liquid
//  tag.category.liquid tag.category.liquid
//  tag.value.oil tag.value.oil
//  tag.value.oil tag.value.oil
//  tag.category.liquid tag.category.liquid
//  tag.category.liquid tag.category.liquid
//  tag.value.cryofluid tag.value.cryofluid
//  tag.value.cryofluid tag.value.cryofluid
//  tag.category.liquid tag.category.liquid
//  tag.category.liquid tag.category.liquid
//  tag.value.neoplasm tag.value.neoplasm
//  tag.value.neoplasm tag.value.neoplasm
//  tag.category.liquid tag.category.liquid
//  tag.category.liquid tag.category.liquid
//  tag.value.arkycite tag.value.arkycite
//  tag.value.arkycite tag.value.arkycite
//  tag.category.liquid tag.category.liquid
//  tag.category.liquid tag.category.liquid
//  tag.value.ozone tag.value.ozone
//  tag.value.ozone tag.value.ozone
//  tag.category.liquid tag.category.liquid
//  tag.category.liquid tag.category.liquid
//  tag.value.hydrogen tag.value.hydrogen
//  tag.value.hydrogen tag.value.hydrogen
//  tag.category.liquid tag.category.liquid
//  tag.category.liquid tag.category.liquid
//  tag.value.nitrogen tag.value.nitrogen
//  tag.value.nitrogen tag.value.nitrogen
//  tag.category.liquid tag.category.liquid
//  tag.category.liquid tag.category.liquid
//  tag.value.cyanogen tag.value.cyanogen
//  tag.value.cyanogen tag.value.cyanogen
//  tag.category.type tag.category.type
//  tag.category.type tag.category.type
//  tag.value.unit tag.value.unit
//  tag.value.unit tag.value.unit
//  tag.category.type tag.category.type
//  tag.category.type tag.category.type
//  tag.value.logic tag.value.logic
//  tag.value.logic tag.value.logic
//  tag.category.type tag.category.type
//  tag.category.type tag.category.type
//  tag.value.resource tag.value.resource
//  tag.value.resource tag.value.resource
//  tag.category.type tag.category.type
//  tag.category.type tag.category.type
//  tag.value.j4f tag.value.j4f
//  tag.value.j4f tag.value.j4f
//  tag.category.type tag.category.type
//  tag.category.type tag.category.type
//  tag.value.power tag.value.power
//  tag.value.power tag.value.power
//  tag.category.game-mode tag.category.game-mode
//  tag.category.game-mode tag.category.game-mode
//  tag.value.campaign tag.value.campaign
//  tag.value.campaign tag.value.campaign
//  tag.category.game-mode tag.category.game-mode
//  tag.category.game-mode tag.category.game-mode
//  tag.value.pvp tag.value.pvp
//  tag.value.pvp tag.value.pvp
//  tag.category.game-mode tag.category.game-mode
//  tag.category.game-mode tag.category.game-mode
//  tag.value.attack tag.value.attack
//  tag.value.attack tag.value.attack
//  tag.category.game-mode tag.category.game-mode
//  tag.category.game-mode tag.category.game-mode
//  tag.value.sandbox tag.value.sandbox
//  tag.value.sandbox tag.value.sandbox
//  tag.category.game-mode tag.category.game-mode
//  tag.category.game-mode tag.category.game-mode
//  tag.value.hex tag.value.hex
//  tag.value.hex tag.value.hex
//  tag.category.game-mode tag.category.game-mode
//  tag.category.game-mode tag.category.game-mode
//  tag.value.tower-defense tag.value.tower-defense
//  tag.value.tower-defense tag.value.tower-defense
//  tag.category.verify tag.category.verify
//  tag.category.verify tag.category.verify
//  tag.value.verified tag.value.verified
//  tag.value.verified tag.value.verified
//  tag.category.verify tag.category.verify
//  tag.category.verify tag.category.verify
//  tag.value.unverified tag.value.unverified
//  tag.value.unverified tag.value.unverified

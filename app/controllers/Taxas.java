package controllers;

import play.libs.WS;
import play.libs.WS.HttpResponse;
import play.mvc.*;

import java.util.*;
import org.gbif.ecat.model.ParsedName;
import org.gbif.ecat.parser.NameParser;

import com.google.gson.JsonElement;
import models.*;
import models.Util;

public class Taxas extends Controller {

  public static void autocomplete(String search)
  {
	search = Util.normalize(search);
	search = search.toLowerCase();  
	search = search.replaceAll(" ", "%20");
	List<Taxa> taxas = new ArrayList<Taxa>();	
	NameParser nameParser = new NameParser();
	HttpResponse ecatResponse;

	ecatResponse = WS.url("http://ecat-dev.gbif.org/ws/usage/?&pagesize=30&rkey=1&count=true&q=" + search).get();

	//System.out.println("http://ecat-dev.gbif.org/ws/usage/?rank=g&rkey=1&count=true&q=" + search);
	if(ecatResponse.success())
	{
	  int count = ecatResponse.getJson().getAsJsonObject().get("totalHits").getAsInt(); 

	  if (count < 30)
	  {
		for (int i = 0; i < count; ++i)
		{		 
		  Taxa taxa = new Taxa();
		  ParsedName<String> parsedName = nameParser.parse(ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonArray().get(i).getAsJsonObject().get("scientificName").getAsString());	
		  
		  if (parsedName != null)
		  {
			taxa.canonicalName = parsedName.canonicalName();
			taxa.accordingTo = parsedName.authorshipComplete();
			taxa.rank = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonArray().get(i).getAsJsonObject().get("rank").getAsString();
			taxas.add(taxa);
		  }		  	
		}		
	  }
	}
	renderJSON(taxas);
  }

  public static Taxa ecatInformation(Long taxonId, Taxa taxa)
  {
	// ECAT Information  
	HttpResponse ecatResponse = WS.url("http://ecat-dev.gbif.org/ws/usage/" + taxonId).get();
	if (ecatResponse.success())
	{
	  //System.out.println("http://ecat-dev.gbif.org/ws/usage/" + taxonId);
	  taxa.taxonId = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("taxonID").getAsLong();
	  taxa.rank = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("rank").getAsString();
	  taxa.accordingTo = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("accordingTo").getAsString();
	  taxa.scientificName = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("scientificName").getAsString();
	  taxa.canonicalName = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("canonicalName").getAsString();

	  if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("kingdom").isJsonNull())
		taxa.kingdom = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("kingdom").getAsString();
	  if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("phylum").isJsonNull())
		taxa.phylum = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("phylum").getAsString();
	  if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("class").isJsonNull())
		taxa.classs = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("class").getAsString();
	  if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("order").isJsonNull())
		taxa.order = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("order").getAsString();
	  if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("family").isJsonNull())
		taxa.family = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("family").getAsString();    
	  if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("genus").isJsonNull())
		taxa.genus = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("genus").getAsString();
	  if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("species").isJsonNull())
		taxa.species = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("species").getAsString();

	  if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("kingdomID").isJsonNull())
	  {
		taxa.kingdomID = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("kingdomID").getAsInt();
	  }
	  if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("phylumID").isJsonNull())
		taxa.phylumID = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("phylumID").getAsInt();
	  if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("orderID").isJsonNull())
		taxa.orderID = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("orderID").getAsInt();
	  if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("classID").isJsonNull())
		taxa.classID = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("classID").getAsInt();
	  if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("familyID").isJsonNull())
		taxa.familyID = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("familyID").getAsInt();
	  if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("genusID").isJsonNull())
		taxa.genusID = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("genusID").getAsInt();
	  if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("speciesID").isJsonNull())
		taxa.speciesID = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("speciesID").getAsInt();

	  if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("numP").isJsonNull())
		taxa.nbPhylum = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("numP").getAsInt();
	  if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("numC").isJsonNull())
		taxa.nbClass = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("numC").getAsInt();
	  if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("numO").isJsonNull())
		taxa.nbOrder = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("numO").getAsInt();
	  if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("numF").isJsonNull())
		taxa.nbFamily = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("numF").getAsInt();
	  if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("numG").isJsonNull())
		taxa.nbGenus = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("numG").getAsInt();
	  if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("numP").isJsonNull())
		taxa.nbSpecies = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("numS").getAsInt(); 
	}
	return taxa;
  }

  public static Taxa eolInformation(Taxa taxa)
  {
	// EOL Information
	HttpResponse eolResponse = WS.url("http://eol.org/api/search/" + taxa.canonicalName.replaceAll(" ", "%20") + ".json").get();
	System.out.println("http://eol.org/api/search/" + taxa.canonicalName.replaceAll(" ", "%20") + ".json");
	if (eolResponse.success() && eolResponse.getJson().getAsJsonObject().get("results").getAsJsonArray().size() > 0)
	{
	  if (!eolResponse.getJson().getAsJsonObject().get("results").getAsJsonArray().get(0).getAsJsonObject().get("id").isJsonNull())
		taxa.eolID = eolResponse.getJson().getAsJsonObject().get("results").getAsJsonArray().get(0).getAsJsonObject().get("id").getAsInt();
	  eolResponse = WS.url("http://eol.org/api/pages/1.0/" + taxa.eolID + ".json?common_names=1&details=1&images=12&subjects=all&text=1").get();
	  System.out.println("http://eol.org/api/pages/1.0/" + taxa.eolID + ".json?common_names=1&details=1&images=12&subjects=all&text=1");
	  if (eolResponse.success())
	  {
		int size = eolResponse.getJson().getAsJsonObject().get("dataObjects").getAsJsonArray().size();
		if (size > 0)
		{
		  if (eolResponse.getJson().getAsJsonObject().get("dataObjects").getAsJsonArray().get(0).getAsJsonObject().has("description")
			  && eolResponse.getJson().getAsJsonObject().get("dataObjects").getAsJsonArray().get(0).getAsJsonObject().has("title"))	
			//&& eolResponse.getJson().getAsJsonObject().get("dataObjects").getAsJsonArray().get(0).getAsJsonObject().get("title").getAsString().equals("Overview"))
			taxa.description = eolResponse.getJson().getAsJsonObject().get("dataObjects").getAsJsonArray().get(0).getAsJsonObject().get("description").getAsString();
		  List<ArrayList<String>> mediaURLs = new ArrayList<ArrayList<String>>();
		  for (int i = 1; i < size; ++i)
		  {
			if (eolResponse.getJson().getAsJsonObject().get("dataObjects").getAsJsonArray().get(i).getAsJsonObject().has("eolThumbnailURL") 
				&& eolResponse.getJson().getAsJsonObject().get("dataObjects").getAsJsonArray().get(i).getAsJsonObject().has("eolMediaURL")
				&& eolResponse.getJson().getAsJsonObject().get("dataObjects").getAsJsonArray().get(i).getAsJsonObject().has("mimeType")
				&& eolResponse.getJson().getAsJsonObject().get("dataObjects").getAsJsonArray().get(i).getAsJsonObject().get("mimeType").getAsString().equals("image/jpeg"))
			{  
			  ArrayList<String> medias = new ArrayList<String>();  
			  medias.add(eolResponse.getJson().getAsJsonObject().get("dataObjects").getAsJsonArray().get(i).getAsJsonObject().get("eolThumbnailURL").getAsString());
			  medias.add(eolResponse.getJson().getAsJsonObject().get("dataObjects").getAsJsonArray().get(i).getAsJsonObject().get("eolMediaURL").getAsString());
			  mediaURLs.add(medias);
			}
		  }
		  taxa.mediaURLs = mediaURLs;	
		}        
	  }
	} 
	return taxa;
  }

  public static Taxa getTaxonomy(Occurrence occurrence)
  {
	Taxa taxa = new Taxa(); 

	//Parse the scientificName in genus and specificEpithet
	NameParser parser = new NameParser();
	parser.debug = false;
	ParsedName<String> parsedName;
	//String infraSpecificEpithet;
	parsedName = parser.parse(occurrence.scientificName);
	/* le nom scientifique n'a pas pu être parsé, mettre à jour le status en 'invalid' et passer au suivant*/
	if (parsedName == null) {
	  occurrence.taxonStatus = "invalid";
	  return null;
	}
	String genus = parsedName.genusOrAbove;
	String specificEpithet = parsedName.specificEpithet;

	//ECAT Information
	char rank;  
	HttpResponse ecatResponse;
	if (specificEpithet == null)
	{
	  rank = 'g';
	  ecatResponse = WS.url("http://ecat-dev.gbif.org/ws/usage/?rkey=1&sort=alpha&pagesize=100&rank=" + rank 
		  + "&q=" + genus).get();
	}
	else
	{
	  rank = 's';  
	  ecatResponse = WS.url("http://ecat-dev.gbif.org/ws/usage/?rkey=1&sort=alpha&pagesize=100&rank=" + rank 
		  + "&q=" + genus + "%20" + specificEpithet).get();
	}
	System.out.println("http://ecat-dev.gbif.org/ws/usage/?rkey=1&sort=alpha&pagesize=100&rank=" + rank 
		+ "&q=" + genus + "%20" + specificEpithet);
	if (ecatResponse.success() == false || ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonArray().size() == 0) return null;
	else
	{
	  occurrence.ecatConceptId = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonArray().get(0).getAsJsonObject().get("taxonID").getAsString();
	  ecatResponse = WS.url("http://ecat-dev.gbif.org/ws/usage/" + occurrence.ecatConceptId).get();
	  if (ecatResponse.getStatus() == 200)
	  {
		HttpResponse ecatResponse2 = null;	
		if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("scientificName").isJsonNull())
		  taxa.scientificName = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("scientificName").getAsString();
		if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("kingdomID").isJsonNull())
		{
		  taxa.kingdomID = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("kingdomID").getAsLong();
		  ecatResponse2 = WS.url("http://ecat-dev.gbif.org/ws/usage/"+taxa.kingdomID).get();
		  //System.out.println(ecatResponse2.getJson().getAsJsonObject().get("data").getAsJsonObject().get("canonicalName"));
		  if (!ecatResponse2.getJson().getAsJsonObject().get("data").getAsJsonObject().get("canonicalName").isJsonNull())
			taxa.canonicalKingdom = ecatResponse2.getJson().getAsJsonObject().get("data").getAsJsonObject().get("canonicalName").getAsString();
		}  
		if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("phylumID").isJsonNull())
		{
		  taxa.phylumID = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("phylumID").getAsLong();
		  ecatResponse2 = WS.url("http://ecat-dev.gbif.org/ws/usage/"+taxa.phylumID).get();
		  taxa.canonicalPhylum = ecatResponse2.getJson().getAsJsonObject().get("data").getAsJsonObject().get("canonicalName").getAsString();
		}
		if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("orderID").isJsonNull())
		{
		  taxa.orderID = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("orderID").getAsLong();
		  ecatResponse2 = WS.url("http://ecat-dev.gbif.org/ws/usage/"+taxa.orderID).get();
		  taxa.canonicalOrder = ecatResponse2.getJson().getAsJsonObject().get("data").getAsJsonObject().get("canonicalName").getAsString();
		}
		if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("classID").isJsonNull())
		{
		  taxa.classID = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("classID").getAsLong();
		  ecatResponse2 = WS.url("http://ecat-dev.gbif.org/ws/usage/"+taxa.classID).get();
		  taxa.canonicalClass = ecatResponse2.getJson().getAsJsonObject().get("data").getAsJsonObject().get("canonicalName").getAsString();
		}
		if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("familyID").isJsonNull())
		{
		  taxa.familyID = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("familyID").getAsLong();
		  ecatResponse2 = WS.url("http://ecat-dev.gbif.org/ws/usage/"+taxa.familyID).get();
		  taxa.canonicalFamily = ecatResponse2.getJson().getAsJsonObject().get("data").getAsJsonObject().get("canonicalName").getAsString();
		}
		if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("genusID").isJsonNull())
		{
		  taxa.genusID = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("genusID").getAsLong();
		  ecatResponse2 = WS.url("http://ecat-dev.gbif.org/ws/usage/"+taxa.genusID).get();
		  taxa.canonicalGenus = ecatResponse2.getJson().getAsJsonObject().get("data").getAsJsonObject().get("canonicalName").getAsString();
		}
		if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("speciesID").isJsonNull())
		{
		  taxa.speciesID = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("speciesID").getAsLong();
		  ecatResponse2 = WS.url("http://ecat-dev.gbif.org/ws/usage/"+taxa.speciesID).get();
		  taxa.canonicalSpecies = ecatResponse2.getJson().getAsJsonObject().get("data").getAsJsonObject().get("canonicalName").getAsString();
		}      	    
		if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("kingdom").isJsonNull())
		  taxa.kingdom = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("kingdom").getAsString();
		if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("phylum").isJsonNull())
		  taxa.phylum = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("phylum").getAsString();
		if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("class").isJsonNull())
		  taxa.classs = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("class").getAsString();
		if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("order").isJsonNull())
		  taxa.order = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("order").getAsString();
		if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("family").isJsonNull())
		  taxa.family = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("family").getAsString();
		if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("genus").isJsonNull())
		  taxa.genus = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("genus").getAsString();
		if (!ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("species").isJsonNull())
		  taxa.species = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("species").getAsString();
	  }
	  if (taxa.species != null) taxa.speciesIdentifiedBy = taxa.species.replaceAll(taxa.canonicalSpecies,"");
	  if (taxa.genus != null) taxa.genusIdentifiedBy = taxa.genus.replaceAll(taxa.canonicalGenus,"");
	  return taxa;
	}

  }

  public static void search(String search, int page) {

	/* Splits the search in words */
	String[] splittedSearch = search.split(" ");
	/* for each word, tries to find a corresponding taxa */
	for (int i = 0; i < splittedSearch.length; ++i)
	{
	  HttpResponse ecatResponse = WS.url("http://ecat-dev.gbif.org/ws/usage/?rkey=1&count=true&q=" + splittedSearch[i]).get();	
	  if(ecatResponse.success())
	  {
		int count = ecatResponse.getJson().getAsJsonObject().get("totalHits").getAsInt(); 
		/* if there are results, it could be a genus, try to find a specificEpithet */
		//System.out.println ("count :" + count);
		if (count > 0)
		{
		  if (i+1 < splittedSearch.length)
		  {
			ecatResponse = WS.url("http://ecat-dev.gbif.org/ws/usage/?rkey=1&count=true&q=" + splittedSearch[i] + "%20" + splittedSearch[i+1]).get();
			int count2 = ecatResponse.getJson().getAsJsonObject().get("totalHits").getAsInt(); 
			//System.out.println ("count2 :" + count2);
			if (count2 > 0) search = splittedSearch[i] + "%20" + splittedSearch[i+1];
			else search = splittedSearch[i];
		  }
		  else search = splittedSearch[i];
		  break;
		}
	  }
	}

	int pagesize = 10;
	HttpResponse ecatResponse = WS.url("http://ecat-dev.gbif.org/ws/usage/?rkey=1&count=true&q=" + search.replaceAll(" ", "%20")).get();
	if (ecatResponse.success())
	{
	  int count = ecatResponse.getJson().getAsJsonObject().get("totalHits").getAsInt(); 
	  ecatResponse = WS.url("http://ecat-dev.gbif.org/ws/usage/?rkey=1&sort=alpha&pagesize=" + 10 + "&page=" + page + "&q=" + search.replaceAll(" ", "%20")).get();
	  //System.out.println("http://ecat-dev.gbif.org/ws/usage/?rkey=1&sort=alpha&pagesize=" + 10 + "&page=" + page + "&q=" + search.replaceAll(" ", "%20"));


	  List<Taxa> taxas = new ArrayList<Taxa>();
	  int numTaxas = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonArray().size();
	  for (int i = 0; i < numTaxas; ++i)
	  {
		String rank = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonArray().get(i).getAsJsonObject().get("rank").getAsString();
		Taxa taxa = new Taxa();
		taxa.rank = rank;
		taxa.taxonId = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonArray().get(i).getAsJsonObject().get("taxonID").getAsLong();
		taxa.scientificName = ecatResponse.getJson().getAsJsonObject().get("data").getAsJsonArray().get(i).getAsJsonObject().get("scientificName").getAsString();
		taxas.add(taxa);
	  }
	  int taxasTotalPages;
	  if (count < pagesize) 
	  {
		pagesize = count;
		taxasTotalPages = 1;
	  }
	  else taxasTotalPages = count/pagesize + 1;
	  int current = page;
	  render ("Application/Search/taxas.html", taxas, taxasTotalPages, search, count, current, pagesize);
	}
  }

  public static void show(Long taxonId) {


	Taxa taxa = new Taxa();  
	taxa = ecatInformation(taxonId, taxa);
	taxa = eolInformation(taxa);

	render(taxa);
  }

  public static void showChildren(Long taxonId, String rank, Integer page) { 
	int pagesize = 50;
	int totalPages;
	HttpResponse usageResponse = WS.url("http://ecat-dev.gbif.org/ws/usage/" + taxonId).get();
	int numRank = usageResponse.getJson().getAsJsonObject().get("data").getAsJsonObject().get("num" + rank.toUpperCase().charAt(0)).getAsInt();
	if (numRank < pagesize) 
	{
	  pagesize = numRank;
	  totalPages = 1;
	}
	else totalPages = numRank/pagesize + 1;

	HttpResponse response = WS.url("http://ecat-dev.gbif.org/ws/nav/" + taxonId +"?rank=" +rank.charAt(0)+"&page="+ page + "&pagesize=" + pagesize + "&sort=alpha").get();
	pagesize = response.getJson().getAsJsonObject().get("data").getAsJsonArray().size();
	//System.out.println("http://ecat-dev.gbif.org/ws/nav/" + taxonId +"?rank=" +rank.charAt(0)+"&page="+ page + "&pagesize=" + pagesize + "&sort=alpha");
	List<Taxa> children = new ArrayList<Taxa>();

	for (int i = 0; i < pagesize; ++i) {
	  JsonElement jsScientificName = response.getJson().getAsJsonObject().get("data").getAsJsonArray().get(i).getAsJsonObject().get("scientificName");
	  JsonElement jsTaxonID = response.getJson().getAsJsonObject().get("data").getAsJsonArray().get(i).getAsJsonObject().get("taxonID");
	  Taxa child = new Taxa();
	  child.taxonId = jsTaxonID.getAsLong();
	  child.scientificName = jsScientificName.getAsString();	
	  children.add(child);
	}
	render("Taxas/show_children.html",numRank, children, rank, totalPages);
  }



}
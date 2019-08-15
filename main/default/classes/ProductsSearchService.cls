public with sharing class ProductsSearchService
{
	public static  List<List<Product_Field__c>> searchProducts(Set<Id> categoryIds, List<List<String>> filters)
	{
        List<Product_To_Category__c> productToCategories = [
            SELECT Product__c
            FROM Product_To_Category__c
            WHERE Category__c IN :categoryIds
        ];
        
        Set<Id> productIds1 = new Set<Id>();
        
        for (Product_To_Category__c currentProductToCategory : productToCategories)
        {
            productIds1.add(currentProductToCategory.Product__c);
        }
		
		String query = 'SELECT Value__c, Product__c, Product_Configuration__r.Api_Name__c FROM Product_Field__c WHERE (';
		
		for (List<String> currentFilter : filters)
		{
			query += generateQuery(currentFilter);
		}
	
		if (!filters.isEmpty())
		{
			query = query.substring(0, query.length()-3) + ')) AND ( ';
		}
		
		query += ' Product__c IN :productIds1)';
		
		System.debug(query);
		
		List<Product_Field__c> productFields = (List<Product_Field__c>)Database.query(query);
		Set<Id> productIds = new Set<Id>();
		
		for (Product_Field__c currentProductField : productFields)
		{
			productIds.add(currentProductField.Product__c);
		}
		
		List<Product2> products = [
			SELECT Id,
				(SELECT Value__c, Product_Configuration__r.Api_Name__c
				FROM Product_Fields__r
				ORDER BY Product_Configuration__r.Api_Name__c ASC)
			FROM Product2
			WHERE Id IN :productIds
		];
		
		List<Product_Configuration__c> productConfigurations = [
			SELECT Id, Api_Name__c
			FROM Product_Configuration__c
			ORDER BY Api_Name__c ASC
		];
		
		Integer configsCount = productConfigurations.size();
		Map<Id, List<Product_Field__c>> valuesByProduct = new Map<Id, List<Product_Field__c>>();
		
		for (Product2 currentProduct : products)
		{
			List<Product_Field__c> productDepFields = currentProduct.Product_Fields__r;
			
			for (Integer index = 0; index < productConfigurations.size(); index++)
			{
				System.debug(index);
				System.debug(productDepFields);
				
				if ((index >= productDepFields.size())
					|| (productConfigurations[index].Api_Name__c != productDepFields[index].Product_Configuration__r.Api_Name__c))
				{
					System.debug(productConfigurations[index].Api_Name__c);
	
					productDepFields.add(index, new Product_Field__c(
						Product_Configuration__c = productConfigurations[index].Id
					));
				}
				
				System.debug(productDepFields);
			}
			
			valuesByProduct.put(currentProduct.Id, productDepFields);
		}
		
		
		System.debug(productFields);
		System.debug(products);
		
		/*Map<Id, List<Product_Field__c>> valuesByProduct = new Map<Id, List<Product_Field__c>>();
		
		for (Product2 currentProduct : products)
		{
		
		}
		
		for (Product_Field__c currentField : productFields)
		{
			if (!valuesByProduct.containsKey(currentField.Product__c))
			{
				valuesByProduct.put(currentField.Product__c, new List<Product_Field__c>());
			}
			
			valuesByProduct.get(currentField.Product__c).add(currentField);
		}
		
		System.debug(valuesByProduct.values());*/
		
		return valuesByProduct.values();
		
		//return valuesByProduct.values();
	}
	
	private static String generateQuery(List<String> params)
	{
		String query = '';
		String apiName = params[0];
		String type = params[1];
		String value = String.isBlank(params[2]) ? null : formatValue(params[2]);
		String secondValue;
		
		if (params.size() > 3)
		{
			secondValue = String.isBlank(params[3]) ? null : formatValue(params[3]);
		}
		
		if (type == 'number')
		{
			query += '( Product_Configuration__r.Api_Name__c = ' + '\'' + apiName + '\' ';
			
			if (!String.isBlank(value) && !String.isBlank(secondValue))
			{
				query += ' AND ( Number_Value__c > ' + Integer.valueOf(value) + ' AND Number_Value__c < ' + Integer.valueOf(secondValue);
			}

			if (!String.isBlank(value) && String.isBlank(secondValue))
			{
				query += ' AND ( Number_Value__c > ' + Integer.valueOf(value);
			}

			if (String.isBlank(value) && String.isBlank(secondValue))
			{
			
			}

			if (String.isBlank(value) && !String.isBlank(secondValue))
			{
				query += ' AND ( Number_Value__c < ' + Integer.valueOf(secondValue);
			}
			
			query += ') AND';
		}
		else if (type == 'text')
		{
			query += '( Product_Configuration__r.Api_Name__c = ' + '\'' + apiName + '\' AND Value__c = ' + '\'' + value + '\') AND';
		}
	
		return query;
	}
	
	private static String formatValue(String value)
	{
		Integer valueIndex = 0;
	
		while (valueIndex < value.length())
		{
			Integer appostropheIndex = value.indexOfChar(Utils.APOSTROPHE_CHAR_NUMBER, valueIndex);
		
			if (appostropheIndex != -1)
			{
				value = value.substring(0, appostropheIndex) + '\\' + value.substring(appostropheIndex, value.length());
				valueIndex = appostropheIndex + 2;
			}
			else
			{
				break;
			}
		}
		
		return value;
	}
}

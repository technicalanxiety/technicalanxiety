---
layout: post
title:  "Using Log Analytics to ... view logs"
date:   2024-02-18 09:00 -0600
image:  la-view-logs.jpg
tags:   [Log Analytics]
---

## PURPOSE
{: .text-center}
A little backstory. I was collaborating with a Kubernetes Master collegue of mine ([Peter Grace](https://twitter.com/petergrace), one of the smartest people around) and he was just not enjoying Log Analytics. What ended up happening, he just wasn't happy with how you reviewed logs in the log workspace. I gave him some ideas but it occurs to me that there are those out there that may feel the same. What I'm going to do with this post is go through how to use Log Analytics to view log data. Actually view log data, not just use it for performance monitoring but actually a log aggregation tool.

I'll use a fairly simple example of creating a human-readable table together to quickly show virtual machine status, deallocated, deleted or shutdown. In the KQL, since we're not creating this to be an alert, we'll be using some resource intensive tasks like 'parse_json', text manipulations and tons of 'extend'. Because we'll be creating functions outside our query, you could utilizie the 'materialize()' option but as you'll notice, we are not calculating anything but rather putting tables together so in this case the 'materialize()' function could slow this query down and cause unnecessary resource consumption.

When I'm exploring a new query, I always use the following demo site provided by Microsoft.

> [Log Analytics Demo Site](https://portal.azure.com/#view/Microsoft_OperationsManagementSuite_Workspace/LogsDemo.ReactView)

I get this question often these days, why not just use Copilot to write this for you? Of course you can try and it's a great way to get started and also understand specific functions and some examples but it doesn't work very well in this situation. You can certainly use Copilot to piece together the parts but arranging it and making it work all together is still very much a human task, in this example. Copilot for Azure is great at creating alert queries though. So try everything and put together what you like and how best you work.

---
## WALKTHROUGH 
{: .text-center}

I'll begin by putting the entire query here and then we'll disect it.

```
    let deallocatedVMs = AzureActivity
    | where TimeGenerated > now(-1h)
    | where OperationNameValue has 'microsoft.compute/virtualmachines/deallocate/action' 
        or OperationNameValue has 'microsoft.compute/virtualmachines/start/action'
    | summarize isDeallocation = arg_max(TimeGenerated, *) by _ResourceId;
    let shutdownVMs = AzureActivity
    | where TimeGenerated > now(-1h)
    | extend Title = tostring(parse_json(Properties_d.eventProperties)['title'])
    | extend Status = tostring(parse_json(Properties_d.eventProperties)['currentHealthStatus'])
    | where Title has 'stopped by user or process' 
        and Status has 'unavailable' 
        or OperationNameValue has 'microsoft.compute/virtualmachines/start/action'
    | summarize isShutdown = arg_max(TimeGenerated, *) by _ResourceId;
    let deletedVMs = AzureActivity
    | where TimeGenerated > now(-1h)
    | where OperationNameValue has 'microsoft.compute/virtualmachines/delete'
    | summarize isDeleted = arg_max(TimeGenerated, *) by _ResourceId;
    Heartbeat
    | where TimeGenerated > now(-1h)
    | where ResourceType has 'virtualmachines' and ResourceGroup !has 'databricks'
    | summarize arg_max(TimeGenerated, *) by Computer
    | extend Deallocated = iff((_ResourceId in (deallocatedVMs)), tobool('true'), tobool('false'))
    | extend Shutdown = iff((_ResourceId in (shutdownVMs)), tobool('true'), tobool('false'))
    | extend Deleted = iff((_ResourceId in (deletedVMs)), tobool('true'), tobool('false'))
    | extend FormattedTime=format_datetime(TimeGenerated, 'MM/dd/yyyy hh:mm:ss tt')
    | extend Date = tostring(split(FormattedTime, ' ')[0])
    | extend Time = tostring(split(FormattedTime, ' ')[1])
    | extend TT = tostring(split(FormattedTime, ' ')[2])
    | extend DateTime = strcat(Date, ' ', Time, ' ', TT)
    | project
    ['Virtual Machine']=tolower(Computer),
    ['Resource Group']=tolower(ResourceGroup),
    ['Date and Time']=DateTime,
    ['Operating System']=OSType,
    Deallocated,
    Shutdown,
    Deleted
    | order by ['Date and Time'] asc
```

<br>

In this query we've introduced a more advanced technique of creating **functions** outside of our main query on the `Heartbeat` table. Doing this improves the query be avoiding joining other tables inside the main query. It also simplifies the query significantly. This method is especially useful if you are calculating or comparing, as you'll notice, values. More complex functions can be created and stored in the workspace and called directly from KQL.

The 3 functions use the AzureActivity table to set the values for 3 of the most common virtual machine states. So, we're really creating 3 functions called.
* deallocatedVMs
* shutdownVMs
* deletedVMs

To make things easier, I'm not considering any other potential **state** that a virtual machine could be.

The first `let` function evaluates the `OperationNameValue` column for **deallocate** and **start** actions and summarizes the results by the most recent time stamp by the resource ID. As always, be sure to use `has` as much as possible and to limit the amount of table data by first filtering on **TimeGenerated**. Because the intent of the output is a simple table showing virtual machine state currently, I'm filtering data to the past 1 hour. I'm then filtering out the values we are looking for, deallocate and start. I then summarize that data and only return the resource IDs of each row. It's not important to keep any other details, we'll get those from the `Heartbeat` table in the main query.

>
> let deallocatedVms = AzureActivity
> >   | where TimeGenerated > now(-1h)
> >
> >   | where OperationNameValue has 'microsoft.compute/virtualmachines/deallocate/action' or OperationNameValue has 'microsoft.compute/virtualmachines/start/action'
> >
> >   | summarize isDeallocation = arg_max(TimeGenerated, *) by _ResourceId;


For the next function, `shutdownVMs`

>
> let shutdownVMs = AzureActivity
> >    | where TimeGenerated > now(-1h)
> >
> >    | extend Title = tostring(parse_json(Properties_d.eventProperties)['title'])
> >
> >    | extend Status = tostring(parse_json(Properties_d.eventProperties)['currentHealthStatus'])
> >
> >    | where Title has 'stopped by user or process' and Status has 'unavailable' or OperationNameValue has 'microsoft.compute/virtualmachines/start/action'
> >
> >    | summarize isShutdown = arg_max(TimeGenerated, *) by _ResourceId;


And for the final function, `deletedVMs`

>
> let deletedVMs = AzureActivity
> >    | where TimeGenerated > now(-1h)
> >
> >    | where OperationNameValue has 'microsoft.compute/virtualmachines/delete'
> >
> >    | summarize isDeleted = arg_max(TimeGenerated, *) by _ResourceId;

Now for the fun part. The query itself.

---
## CONCLUSION
{: .text-center}



![The Result](/img/log-results-formatted.png)

**Photo by [Radek Grzybowski](https://unsplash.com/@rgrzybowski) on [Unsplash](https://unsplash.com/photos/8tem2WpFPhM)**
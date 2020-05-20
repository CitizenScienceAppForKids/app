import React from "react";
import FormBio from '../components/templates/FormBio'
import FormEco from '../components/templates/FormEco'
import FormCli from '../components/templates/FormCli'
import * as QueryString from "query-string";

function NewOb(Project){

    const params = QueryString.parse(Project.location.search);
    
    if (params.type === "Biology"){
        return (
            <FormBio id = {params.pid} />
        )
    }
    else if (params.type === "Ecology"){
        return (
            <FormEco id = {params.pid} />
        )
    }
    else if (params.type === "Climatology"){
        return (
            <FormCli id = {params.pid} />
        )
    }
}

export default NewOb;
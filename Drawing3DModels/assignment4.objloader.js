import { loadExternalFile } from './js/utils/utils.js'

/**
 * A class to load OBJ files from disk
 */
class OBJLoader {

    /**
     * Constructs the loader
     * 
     * @param {String} filename The full path to the model OBJ file on disk
     */
    constructor(filename) {
        this.filename = filename
    }

    /**
     * Loads the file from disk and parses the geometry
     * 
     * @returns {[Array<Number>, Array<Number>]} A tuple / list containing 1) the list of vertices and 2) the list of triangle indices
     */
    load() {

        // Load the file's contents
        let contents = loadExternalFile(this.filename)

        // Create lists for vertices and indices
        let vertices = []
        let indices = []


        // TODO: STEP 1
        // Parse the file's contents
        // You can loop through the file line-by-line by splitting the string at line breaks
        // contentx.split('\n')
        let listoflines = contents.split('\n');
        //correct

        // TODO: STEP 2
        // Process (or skip) each line based on its content and call the parsing functions to parse an entry
        // For vertices call OBJLoader.parseVertex
        // For faces call OBJLoader.parseFace
        let finalvertexlist = [];
        let finalindiceslist = [];
        for (let i = 0; i < listoflines.length; i++) 
        {
           let currentstr = listoflines[i].split(' ');
           if (currentstr[0] == 'v') 
           {
            var vertexlist = this.parseVertex(listoflines[i]);
            for (let j = 0; j < vertexlist.length; j++) {
                finalvertexlist.push(vertexlist[j]);
            }
           } else if (currentstr[0] == 'f') 
           {
            var indiceslist = this.parseFace(listoflines[i]);
            for (let j = 0; j < indiceslist.length; j++) {
                finalindiceslist.push(indiceslist[j]);
            }
           }
        }
        //correct

        // TODO: STEP 3
        // Vertex coordinates can be arbitrarily large or small
        // We want to normalize the vertex coordinates to fit within our [-1.0, 1.0]^3 box from the previous assignment
        // As a pre-processing step and to avoid complicated scaling transformations in the main app we perform normalization here
        // Determine the max and min extent of all the vertex coordinates and normalize each entry based on this finding

        // TODO: HINT
        // Look up the JavaScript functions String.split, parseFloat, and parseInt 
        // You will need thim in your parsing functions
        var universalmax = Number.MIN_SAFE_INTEGER;
        var universalmin = Number.MAX_SAFE_INTEGER;
      
        for (let i = 0; i < finalvertexlist.length; i++) 
        {
            if (finalvertexlist[i] < universalmin) 
            {
                universalmin = finalvertexlist[i];
            }
            if (finalvertexlist[i] > universalmax) {
                universalmax = finalvertexlist[i];
            }
        }
    
  
      
        for (let i = 0; i < finalvertexlist.length; i++) {
            finalvertexlist[i] = -1*(1 - (finalvertexlist[i] - universalmin) / (universalmax - universalmin)) + 1*((finalvertexlist[i] - universalmin)/(universalmax - universalmin));
            
        }
        vertices = finalvertexlist;
        indices = finalindiceslist;
        


        // Return the tuple
        return [ vertices, indices ]
    }

    /**
     * Parses a single OBJ vertex entry given as a string
     * Call this function from OBJLoader.load()
     * 
     * @param {String} vertex_string String containing the vertex entry 'v {x} {y} {z}'
     * @returns {Array<Number>} A list containing the x, y, z coordinates of the vertex
     */
    parseVertex(vertex_string) //correct
    {
        var thevertexarray = [];
        var currentvertexstringarr = vertex_string.split(' ');
        for (let i = 1; i < currentvertexstringarr.length; i++) {
            thevertexarray.push(parseFloat(currentvertexstringarr[i]));
        }
        return thevertexarray;
        // TODO: Process the entry and parse numbers to float
    }

    /**
     * Parses a single OBJ face entry given as a string
     * Face entries can refer to 3 or 4 elements making them triangle or quad faces
     * WebGL only supports triangle drawing, so we need to triangulate the entry if we find 4 indices
     * This is done using OBJLoader.triangulateFace()
     * 
     * Each index entry can have up to three components separated by '/' 
     * You need to grad the first component. The other ones are for textures and normals which will be treated later
     * Make sure to account for this fact.
     * 
     * Call this function from OBJLoader.load()
     * 
     * @param {String} face_string String containing the face entry 'f {v0}/{vt0}/{vn0} {v1}/{vt1}/{vn1} {v2}/{vt2}/{vn2} ({v3}/{vt3}/{vn3})'
     * @returns {Array<Number>} A list containing three indices defining a triangle
     */
    parseFace(face_string)
    {
        var facewithspaces = face_string.split(' ');
        var finalindicesarr = [];
        var vzero;  
        var vone;
        var vtwo;
        var vthree;
        //1 indexed 
        if (facewithspaces.length == 5) {
            //triangulate the quad
            vzero = facewithspaces[1].split('/');
            vone = facewithspaces[2].split('/');
            vtwo = facewithspaces[3].split('/');
            vthree = facewithspaces[4].split('/');
            finalindicesarr = [parseInt(vzero[0]) - 1, parseInt(vone[0]) - 1, parseInt(vtwo[0]) -1, parseInt(vthree[0]) - 1];
            finalindicesarr = this.triangulateFace(finalindicesarr);
        } else {
            vzero = facewithspaces[1].split('/');
            vone = facewithspaces[2].split('/');
            vtwo = facewithspaces[3].split('/');
            finalindicesarr = [parseInt(vzero[0]) - 1, parseInt(vone[0]) - 1, parseInt(vtwo[0]) - 1];
        }
        return finalindicesarr;
    
        // TODO: Process the entry and parse numbers to ints
        // TODO: Don't forget to handle triangulation if quads are given
    }

    /**
     * Triangulates a face entry given as a list of 4 indices
     * Use these 4 indices to create indices for two separate triangles that share a side (2 vertices)
     * Return a new index list containing the triangulated indices
     * 
     * @param {Array<Number>} face The quad indices with 4 entries
     * @returns {Array<Number>} The newly created list containing triangulated indices
     */
    triangulateFace(face)
    {
        //[vertex1, vertex2, vertex3, vertex4]
        var vertex1 = face[0];
        var vertex2 = face[1];
        var vertex3 = face[2];
        var vertex4 = face[3];
        var triangulatedarr = [vertex4, vertex1, vertex2, vertex4, vertex2, vertex3];
        return triangulatedarr;
        // TODO: Triangulate the face indices
    }
}

export {
    OBJLoader
}
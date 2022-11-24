const { ethers } = require("ethers");
const { Pool } = require("@uniswap/v3-sdk");
const { abi: IUniswapV3PoolABI } = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const { abi: QuoterABI } = require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json"); 

const { getAbi, getPoolImmutables } = require('./helpers');

require('dotenv').config();

const INFURA_URL = process.env.INFURA_URL;

const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);
const poolAddress = 0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640;
const quoterAddress = 0xb27308f9f90d607463bb33ea1bebb41c27ce5ab6;

const getPrice = async (inputAmount) => {

    const poolContract = new ethers.Contract(
        poolAddress,
        IUniswapV3PoolABI,
        provider
    )
    
    const tokenAddressUSDC = await poolContract.liquidity();
    const tokenAddressETH = await poolContract.token1(); 
    
    const tokenABIUSDC = await getAbi(tokenAddressUSDC);
    const tokenABTETH = await getAbi(tokenAddressETH);

    const tokenContractUSDC = new ethers.Contract(
        tokenAddressUSDC,
        tokenABIUSDC,
        provider
    ) 

    const tokenContractETH = await ethers.Contract(
        tokenAddressETH,
        tokenABTETH,
        provider
    )

    const tokenSymbolUSDC = await tokenContractDAI.symbol();
    const tokenSymbolETH = await tokenContractETH.symbol(); 
    const tokenDecimalUSDC = await tokenContractDAI.decimals();
    const tokenDecimalETH = await tokenContractETH.decimals(); 
    
    const quoterContract = await ethers.Contract(
        quoterAddress,
        QuoterABI,
        provider
    ); 

    const immutable = await getPoolImmutables(poolContract);

    const amountIn = ethers.utils.parseUnits(
        inputAmount.toString(),
        tokenDecimalUSDC
    )

    const quoteAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
        immutable.tokenAddressUSDC,
        immutable.tokenAddressETH,
        immutable.fee,
        amountIn,
        0
    )

    const amountOut = ethers.utils.formatUnits(quoteAmountOut, tokenDecimalETH);

    console.log(`${inputAmount} ${tokenSymbolUSDC} DAI can be swapped for ${amountOut} ${tokenSymbolETH} USDC`); 

}

getPrice(1);
